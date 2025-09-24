from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
import os, traceback
from langchain_pinecone import PineconeVectorStore
from src.helper import get_hf_embeddings
from src.prompt import system_prompt
from pinecone import Pinecone

# LLM client import - keep same as your environment. Example:
# from langchain_google_genai import ChatGoogleGenerativeAI
# For general compatibility you could swap to OpenAI chat models if you prefer.
from langchain_google_genai import ChatGoogleGenerativeAI

from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

load_dotenv()
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
INDEX_NAME = os.environ.get("PINECONE_INDEX", "invest-bot")

if not PINECONE_API_KEY:
    raise RuntimeError("PINECONE_API_KEY not set in .env")

# init pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

print("Connecting to Pinecone index:", INDEX_NAME)
embeddings = get_hf_embeddings()
# Connect to existing index (LangChain wrapper)
docsearch = PineconeVectorStore.from_existing_index(index_name=INDEX_NAME, embedding=embeddings)
retriever = docsearch.as_retriever(search_kwargs={"k": 4})

# Chat model init
try:
    chat = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", temperature=0.2)
    print("Google Gemini model initialized.")
except Exception as e:
    print("Failed to init Google model:", e)
    chat = None

# Build RetrievalQA chain — we feed system prompt + context to the model
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template=system_prompt.replace("{context}", "{context}").replace("{input}", "{question}")
)

qa_chain = None
if chat:
    qa_chain = RetrievalQA.from_chain_type(
        llm=chat,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
else:
    print("Chat model not available — QA chain disabled.")

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("chat.html")  # reuse your existing chat front-end

@app.route("/get", methods=["POST"])
def chat_endpoint():
    if not qa_chain:
        return "Chat not available", 503

    # Handle form data instead of JSON
    user_msg = request.form.get("msg", "")
    if not user_msg:
        return "Message required", 400

    try:
        # run the RAG pipeline
        # RetrievalQA returns: {"result": <answer>, "source_documents": [docs...]}
        resp = qa_chain({"query": user_msg})
        # Depending on chain, result key may be 'result' or 'answer'
        answer = resp.get("result") or resp.get("answer") or str(resp)
        
        # Return just the answer text for the frontend to display
        return answer
    except Exception as e:
        traceback.print_exc()
        return f"Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
