package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"server/utils"
)

type ChatRequest struct {
	UserInput string `json:"user_input"`
	Prompt    string `json:"prompt"`
	Document  string `json:"document"`
}


type ChatResponse struct {
	Result string `json:"result"`
	Error  string `json:"error,omitempty"`
}

func ChatHandler(w http.ResponseWriter, r *http.Request) {
	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		http.Error(w, "Missing OpenAI API key", http.StatusInternalServerError)
		return
	}

	if req.Document != "" {
		result, warning, err := utils.RunAutoAnalysis(req.Document, apiKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		resp := ChatResponse{
			Result: result,
			Error:  warning,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
		return
	}

	if req.UserInput != "" && req.Prompt != "" {
		result, err := utils.ProcessTextWithPrompt(req.UserInput, req.Prompt, apiKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ChatResponse{Result: result})
		return
	}

	http.Error(w, "Missing document or prompt", http.StatusBadRequest)
}
