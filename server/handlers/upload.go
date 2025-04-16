package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"server/utils"
)

type ExtractedFile struct {
	FileName string `json:"file_name"`
	Text     string `json:"text"`
}

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	const maxMemory = 8 * 1024 * 1024

	err := r.ParseMultipartForm(maxMemory)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		log.Printf("[Error] parsing form: %v", err)
		return
	}

	defer func() {
		if err := r.MultipartForm.RemoveAll(); err != nil {
			http.Error(w, "Error cleaning up form files", http.StatusInternalServerError)
			log.Printf("[Error] cleaning up form files: %v", err)
		}
	}()

	files := r.MultipartForm.File["file"]
	var results []ExtractedFile

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		http.Error(w, "Missing OpenAI API key", http.StatusInternalServerError)
		return
	}

	for _, header := range files {
		file, err := header.Open()
		if err != nil {
			http.Error(w, "[Error] opening file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		dst, err := os.Create("./storage/" + header.Filename)
		if err != nil {
			http.Error(w, "[Error] saving file", http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		_, err = io.Copy(dst, file)
		if err != nil {
			http.Error(w, "[Error] writing file", http.StatusInternalServerError)
			return
		}

		text, err := utils.ExtractText(dst.Name())
		if err != nil {
			http.Error(w, "[Error] extracting text", http.StatusInternalServerError)
			log.Printf("[Error] extracting text from %s: %v", dst.Name(), err)
			return
		}

		// 기본 프롬프트를 요약으로 설정
		summary, err := utils.ProcessTextWithPrompt(text, "요약해줘", apiKey)
		if err != nil {
			http.Error(w, "[Error] processing text", http.StatusInternalServerError)
			log.Printf("[Error] processing text from %s: %v", dst.Name(), err)
			return
		}

		results = append(results, ExtractedFile{
			FileName: header.Filename,
			Text:     summary,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
