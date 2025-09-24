from dotenv import load_dotenv
import os
from src.helper import load_pdf_files, filter_to_minimal_docs, text_split, download_embeddings # Corrected function names
from pinecone import Pinecone
from pinecone import ServerlessSpec 
from langchain_pinecone import PineconeVectorStore

load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

# Note: I corrected function names to match your helper.py
extracted_data = load_pdf_files(data='data/') 
filter_data = filter_to_minimal_docs(extracted_data)
text_chunks = text_split(filter_data)

embeddings = download_embeddings()

pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "invest-bot"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=384,  # all-MiniLM-L6-v2 has a dimension of 384
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

docsearch = PineconeVectorStore.from_documents(
    documents=text_chunks,
    index_name=index_name,
    embedding=embeddings, 
)

print("Indexing complete and data stored in Pinecone.")