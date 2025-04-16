from pdf2image import convert_from_path
import pytesseract
import sys


def extract_text(pdf_path):
    pages = convert_from_path(pdf_path, dpi=200)
    text = ""
    for page in pages:
        text += pytesseract.image_to_string(page)
    return text


if __name__ == "__main__":
    try:
        result = extract_text(sys.argv[1])
        print(result)
    except Exception as e:
        print(f"[ERROR] PDF OCR failed: {e}", file=sys.stderr)
        exit(1)
