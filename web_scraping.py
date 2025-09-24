import requests
from bs4 import BeautifulSoup
from fpdf import FPDF
from urllib.parse import urlparse
import re
import os # <-- Import the os module

def scrape_and_save_as_pdf(url, output_filename=None):
    """
    Scrapes a URL and saves it to a PDF inside a sibling 'data' directory.
    """
    try:
        # --- DEFINE THE SAVE DIRECTORY ---
        # The path '../data' means "go up one level, then into the 'data' folder".
        save_dir = 'data'
        
        # Create the directory if it doesn't exist, without raising an error.
        os.makedirs(save_dir, exist_ok=True)

        if output_filename is None:
            parsed_url = urlparse(url)
            domain = parsed_url.netloc.replace('www.', '').replace('.', '-')
            path_parts = [part for part in parsed_url.path.split('/') if part]
            slug = '_'.join(path_parts[-2:])
            filename_base = f"{domain}_{slug}"
            sanitized_base = re.sub(r'[\\/*?:"<>|]', "", filename_base)
            filename = f"{sanitized_base}.pdf"
        else:
            filename = output_filename
            
        # --- CONSTRUCT THE FULL FILE PATH ---
        # Join the directory path and filename for a clean, OS-compatible path
        full_path = os.path.join(save_dir, filename)

        print(f"Fetching content from {url}...")
        response = requests.get(url)
        response.raise_for_status()

        # (Rest of the scraping and PDF generation code is the same...)
        soup = BeautifulSoup(response.content, 'html.parser')
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()
        text = soup.get_text()
        cleaned_text = '\n'.join(chunk.strip() for chunk in text.splitlines() if chunk.strip())

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, txt=cleaned_text.encode('latin-1', 'replace').decode('latin-1'))
        
        # Save the PDF to the full path
        pdf.output(full_path)
        
        print(f"✅ Success! Content saved to '{full_path}'")

    except Exception as e:
        print(f"❌ An error occurred: {e}")

