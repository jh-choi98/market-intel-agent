package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"server/utils"
)

type ChatRequest struct {
	UserInput string `json:"user_input"`   // Follow-up question or user input
	Prompt    string `json:"prompt"`       // Prompt to guide LLM
	Document  string `json:"document"`     // Full document text for auto analysis
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

	// 🔹 Step 1: 문서가 들어오면 자동 분석 먼저 수행
	if req.Document != "" {
		result, warning, err := utils.RunAutoAnalysis(req.Document, apiKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// 줄바꿈 포함한 결과 응답
		resp := ChatResponse{
			Result: result,
			Error:  warning,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
		return
	}

	// 🔹 Step 2: 유저가 follow-up 질문한 경우
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



// func ChatHandler(w http.ResponseWriter, r *http.Request) {
// 	var req ChatRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	apiKey := os.Getenv("OPENAI_API_KEY")
// 	if apiKey == "" {
// 		http.Error(w, "Missing OpenAI API key", http.StatusInternalServerError)
// 		return
// 	}

// 	result, err := utils.ProcessTextWithPrompt(req.UserInput, req.Prompt, apiKey)
// 	if err != nil {
// 		w.Header().Set("Content-Type", "application/json")
// 		w.WriteHeader(http.StatusInternalServerError)
// 		json.NewEncoder(w).Encode(ChatResponse{Error: err.Error()})
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(ChatResponse{Result: result})
// }
