from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# --- 1. Load Environment Variables & Initialize Groq Client ---
load_dotenv()

app = FastAPI(title="AI Financial Coach - LLM API")

# The Groq client automatically looks for the GROQ_API_KEY in your environment
try:
    client = Groq()
except Exception as e:
    raise RuntimeError(f"Failed to initialize Groq client. Is GROQ_API_KEY set in your .env file? Error: {e}")


# --- 2. Data Models for Incoming Requests (UPDATED) ---
class AdviceRequest(BaseModel):
    persona: str
    amount: float
    user_goal: str
    transaction_category: str
    monthly_budget: float
    current_monthly_spend: float  # How much the user has spent *before* this transaction


# --- 3. API Endpoint ---
@app.post("/generate_advice")
def generate_advice(request: AdviceRequest):
    """
    Generates personalized financial advice by calling the Groq Llama 3 API.
    The logic changes based on whether the transaction is 'Impulse' or not.
    """
    system_prompt = ""
    user_prompt = ""
    max_response_tokens = 100  # Default for short messages

    # --- Step 1: Dynamically create prompts based on the transaction type ---
    if request.transaction_category == 'Impulse':
        # --- Calculate budget impact for the prompt ---
        if request.monthly_budget > 0:
            percentage_spent_after = ((request.current_monthly_spend + request.amount) / request.monthly_budget) * 100
        else:
            percentage_spent_after = 100  # Default to 100 if budget is zero

        system_prompt = f"You are an AI Financial Coach, a financial bot. Your tone is slightly urgent when user's transactions are impulsive but always encouraging and non-judgmental. The user's financial persona is '{request.persona}'."

        # --- THIS IS THE ENHANCED PROMPT WITH BUDGET CONTEXT ---
        user_prompt = f"""
I just made an impulsive purchase of ₹{request.amount}.
My financial context:
- My main goal is '{request.user_goal}'.
- My monthly budget is ₹{request.monthly_budget}.
- After this purchase, I have now spent {percentage_spent_after:.0f}% of my total budget for the month.

Please provide detailed, actionable advice in Markdown format (around 150-200 words). The advice must include:
1.  An empathetic opening that acknowledges the purchase AND its impact on my budget.
2.  A section called "**Future Strategies**" with 2 concrete methods to avoid similar impulse buys.
3.  A section called "**Productive Channeling**" with 2 creative ideas on how I could have used that ₹{request.amount} to better align with my '{request.persona}' personality and accelerate my goal of '{request.user_goal}'.
"""
        max_response_tokens = 400  # Allow for a longer, more detailed response

    else:  # For 'Growth', 'Joy', or 'Survival'
        # --- NEW: CALCULATE BUDGET IMPACT FOR NON-IMPULSE BUYS ---
        if request.monthly_budget > 0:
            percentage_spent_after = ((request.current_monthly_spend + request.amount) / request.monthly_budget) * 100
        else:
            percentage_spent_after = 0

        system_prompt = f"You are 'AI Financial Coach', a positive and gentle financial bot. The user's financial persona is '{request.persona}'."

        # --- NEW: CONDITIONAL PROMPT BASED ON BUDGET THRESHOLD ---
        if percentage_spent_after > 85:  # If budget is getting tight
            user_prompt = f"""
I just made an essential purchase of ₹{request.amount} categorized as '{request.transaction_category}'.
My financial context:
- My budget is ₹{request.monthly_budget}.
- I have now spent {percentage_spent_after:.0f}% of my budget.
- My main goal is '{request.user_goal}'.

Please give me a message (under 100 words) that does two things:
1. Praises my smart spending on this necessary item.
2. Gently points out that my budget is tight and I should be mindful with my remaining funds to still reach my goal of '{request.user_goal}'.
"""
            max_response_tokens = 150  # Allow for a slightly longer, nuanced response
        else:  # If budget is still healthy
            user_prompt = f"I just made a responsible purchase of ₹{request.amount} categorized as '{request.transaction_category}'. Please give me a short, positive reinforcement message (under 100 words) to praise my smart spending."

    try:
        # --- Step 2: Make the API call to Groq ---
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=max_response_tokens,
            top_p=1,
        )

        # --- Step 3: Extract the advice from the response ---
        advice = completion.choices[0].message.content
        return {"advice": advice.strip()}

    except Exception as e:
        # Catches API errors, authentication issues, etc.
        raise HTTPException(status_code=500, detail=f"Error communicating with Groq API: {e}")

