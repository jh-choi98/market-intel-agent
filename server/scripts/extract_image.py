import sys
from PIL import Image
import pytesseract


def extract_text(image_path):
    text = pytesseract.image_to_string(Image.open(image_path))
    print(text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[Error] No image path provided.")
        sys.exit(1)

    extract_text(sys.argv[1])
