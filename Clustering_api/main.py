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

    # Convert timestamp safely
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
    df = df.dropna(subset=['timestamp', 'amount', 'category'])

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

    transaction_frequency = df['timestamp'].dt.to_period("M").nunique()
    transaction_frequency = transaction_frequency if transaction_frequency > 0 else 1

    avg_transaction_value = df['amount'].mean()
    avg_impulse_amount = df.loc[df['category'] == "Impulse", 'amount'].mean() if any(df['category'] == "Impulse") else 0
    weekend_spending_pct = df.loc[
                               df['timestamp'].dt.weekday >= 5, 'amount'].sum() / total_spend if total_spend > 0 else 0
    late_night_spending_pct = df.loc[(df['timestamp'].dt.hour >= 22) | (
                df['timestamp'].dt.hour < 4), 'amount'].sum() / total_spend if total_spend > 0 else 0
    median_transaction_value = df['amount'].median()
    std_transaction_value = df['amount'].std()

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
    X_scaled = scaler.transform(features)
    cluster = kmeans.predict(X_scaled)[0]
    persona = cluster_to_persona.get(cluster, "Unknown Persona")

    return {"cluster": int(cluster), "persona": persona}


# -------------------------
# API Endpoint: CSV Upload
# -------------------------
@app.post("/predict_csv")
async def predict_from_csv(file: UploadFile = File(...)):
    try:
        # Read uploaded CSV into DataFrame
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))

        # Run preprocessing + prediction
        result = preprocess_and_predict(df)
        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
