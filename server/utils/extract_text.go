package utils

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func readCSV(fp string) ([]byte, error) {
	f, err := os.Open(fp)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	data, err := io.ReadAll(f)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func ExtractText(fp string) (string, error) {
	ext := strings.ToLower(filepath.Ext(fp))

	switch ext {
	case ".txt":
		data, err := os.ReadFile(fp)

		if err != nil {
			return "", fmt.Errorf("[Error] extracting .txt file: %v", err)
		}
		return string(data), nil
	case ".csv":
		data, err := readCSV(fp)
		if err != nil {
			return "", fmt.Errorf("[Error] extracting .csv file: %v", err)
		}
		return string(data), nil
	case ".pdf":
		out, err := exec.Command("python3", "scripts/extract_pdf.py", fp).Output()
		if err != nil {
			return "", fmt.Errorf("[Error] extracting .pdf: %v", err)
		}
		return string(out), nil
	case ".png", ".jpg":
		out, err := exec.Command("python3", "scripts/extract_image.py", fp).Output()
		if err != nil {
			return "", fmt.Errorf("[Error] extracting .png or .jpg: %v", err)
		}
		return string(out), nil
	default:
		return "", fmt.Errorf("[Error] unsupported file type: %s", ext)
	}
}
