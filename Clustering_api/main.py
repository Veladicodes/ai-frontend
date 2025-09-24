from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import joblib
from io import BytesIO

# -------------------------
# Load model & scaler
# -------------------------
scaler = joblib.load("models/scaler.joblib")
kmeans = joblib.load("models/kmeans_model.joblib")

cluster_to_persona = {
    0: "Disciplined Planner",
    1: "Experience Seeker",
    2: "Spontaneous Spender",
    3: "Routine Essentialist"
}

# -------------------------
# FastAPI app
# -------------------------
app = FastAPI(title="Spender Persona API (CSV Upload Version)")


# -------------------------
# Preprocessing + prediction function
# -------------------------
def preprocess_and_predict(df: pd.DataFrame):
    # Ensure required columns exist
    required_cols = {"timestamp", "amount", "category"}
    if not required_cols.issubset(df.columns):
        raise ValueError(f"CSV must contain columns: {required_cols}")

    # Convert timestamp safely - handle different formats
    try:
        df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    except Exception as e:
        print(f"Timestamp conversion error: {e}")
        raise ValueError(f"Invalid timestamp format: {e}")
    
    # Drop rows with invalid timestamps or missing data
    df = df.dropna(subset=['timestamp', 'amount', 'category'])
    
    # Ensure amount is numeric
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    df = df.dropna(subset=['amount'])

    # Keep only relevant categories
    expected_categories = ['Survival', 'Growth', 'Joy', 'Impulse']
    df = df[df['category'].isin(expected_categories)]

    if df.empty:
        raise ValueError("No valid transactions found after preprocessing.")

    # -------------------------
    # Feature engineering
    # -------------------------
    total_spend = df['amount'].sum()
    impulse_spending_pct = df.loc[df['category'] == "Impulse", 'amount'].sum() / total_spend if total_spend > 0 else 0
    joy_spending_pct = df.loc[df['category'] == "Joy", 'amount'].sum() / total_spend if total_spend > 0 else 0
    growth_spending_pct = df.loc[df['category'] == "Growth", 'amount'].sum() / total_spend if total_spend > 0 else 0
    survival_spending_pct = df.loc[df['category'] == "Survival", 'amount'].sum() / total_spend if total_spend > 0 else 0

    # Safe calculation of transaction frequency
    try:
        transaction_frequency = df['timestamp'].dt.to_period("M").nunique()
        transaction_frequency = max(transaction_frequency, 1)  # Ensure at least 1
    except Exception as e:
        print(f"Transaction frequency calculation error: {e}")
        transaction_frequency = 1

    avg_transaction_value = df['amount'].mean()
    avg_impulse_amount = df.loc[df['category'] == "Impulse", 'amount'].mean() if any(df['category'] == "Impulse") else 0
    
    # Safe weekend spending calculation
    try:
        weekend_spending_pct = df.loc[df['timestamp'].dt.weekday >= 5, 'amount'].sum() / total_spend if total_spend > 0 else 0
    except Exception as e:
        print(f"Weekend spending calculation error: {e}")
        weekend_spending_pct = 0
    
    # Safe late night spending calculation
    try:
        late_night_spending_pct = df.loc[(df['timestamp'].dt.hour >= 22) | (df['timestamp'].dt.hour < 4), 'amount'].sum() / total_spend if total_spend > 0 else 0
    except Exception as e:
        print(f"Late night spending calculation error: {e}")
        late_night_spending_pct = 0
        
    median_transaction_value = df['amount'].median()
    std_transaction_value = df['amount'].std()
    
    # Handle NaN values
    if pd.isna(std_transaction_value):
        std_transaction_value = 0

    features = pd.DataFrame([{
        "total_spend": total_spend,
        "impulse_spending_pct": impulse_spending_pct,
        "joy_spending_pct": joy_spending_pct,
        "growth_spending_pct": growth_spending_pct,
        "survival_spending_pct": survival_spending_pct,
        "transaction_frequency": transaction_frequency,
        "avg_transaction_value": avg_transaction_value,
        "avg_impulse_amount": avg_impulse_amount,
        "weekend_spending_pct": weekend_spending_pct,
        "late_night_spending_pct": late_night_spending_pct,
        "median_transaction_value": median_transaction_value,
        "std_transaction_value": std_transaction_value
    }])

    # -------------------------
    # Scale + Predict
    # -------------------------
    try:
        print(f"Features before scaling: {features}")
        X_scaled = scaler.transform(features)
        print(f"Features after scaling: {X_scaled}")
        cluster = kmeans.predict(X_scaled)[0]
        persona = cluster_to_persona.get(cluster, "Unknown Persona")
        print(f"Predicted cluster: {cluster}, persona: {persona}")
        return {"cluster": int(cluster), "persona": persona}
    except Exception as e:
        print(f"Error in scaling/prediction: {e}")
        import traceback
        traceback.print_exc()
        raise ValueError(f"Model prediction error: {e}")


# -------------------------
# API Endpoint: CSV Upload
# -------------------------
@app.post("/predict_csv")
async def predict_from_csv(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        # Read uploaded CSV into DataFrame
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
            
        df = pd.read_csv(BytesIO(contents))
        
        # Check if DataFrame is empty
        if df.empty:
            raise HTTPException(status_code=400, detail="CSV file is empty")
        
        # Debug: Print column names and first few rows
        print(f"CSV columns: {df.columns.tolist()}")
        print(f"First 3 rows:\n{df.head(3)}")

        # Run preprocessing + prediction
        result = preprocess_and_predict(df)
        return result

    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty or invalid")
    except pd.errors.ParserError as e:
        raise HTTPException(status_code=400, detail=f"CSV parsing error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Data validation error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Processing error: {str(e)}")
