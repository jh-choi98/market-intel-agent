package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

const chunkSize = 1500

func chunkText(text string, size int) []string {
	var chunks []string
	runes := []rune(text)
	for i := 0; i < len(runes); i += size {
		end := i + size
		if end > len(runes) {
			end = len(runes)
		}
		chunks = append(chunks, string(runes[i:end]))
	}
	return chunks
}

func RunAutoAnalysis(text, apiKey string) (string, string, error) {
	chunks := chunkText(text, chunkSize)
	fullText := strings.Join(chunks, "\n\n")

	prompt := `
You are an AI assistant that analyzes business and economic documents.

Your tasks are:
1. Summarize the document clearly and concisely.
2. Identify any trends related to markets, spending patterns, or economic behaviors.
3. For each trend, include a quote or brief paraphrase from the document as evidence.

If you find no market or economic trends, write: "No market or economic trends found."

⚠️ Only include that sentence if there are truly no identifiable patterns or trends. Do not write it if any trends are mentioned.

Please format your answer like this:

Summary:
...

Market Trends:
1. ...
   - Supporting quote: "..."

2. ...
   - Supporting quote: "..."

Now, here is the document:

` + fullText


	result, err := callOpenAI(prompt, apiKey)
	if err != nil {
		return "", "", err
	}

	var warning string
	if strings.Contains(strings.ToLower(result), "No market or economic trends found.") {
		warning = "The uploaded document does not seem to contain market trends. Was this intentional?"
	}

	return result, warning, nil
}


func callOpenAI(prompt string, apiKey string) (string, error) {
	openAIPrompt := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
	}

	body, err := json.Marshal(openAIPrompt)
	if err != nil {
		return "", fmt.Errorf("failed to marshal prompt: %v", err)
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(body))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("OpenAI API call failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("OpenAI API error: %s", string(respBody))
	}

	var response struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", fmt.Errorf("failed to decode response: %v", err)
	}

	if len(response.Choices) == 0 {
		return "", fmt.Errorf("no choices returned from OpenAI")
	}

	return strings.TrimSpace(response.Choices[0].Message.Content), nil
}

func ProcessTextWithPrompt(text, instruction, apiKey string) (string, error) {
	chunks := chunkText(text, chunkSize)

	var results []string
	for i, chunk := range chunks {
		combined := fmt.Sprintf("%s\n\n%s", instruction, chunk)
		result, err := callOpenAI(combined, apiKey)
		if err != nil {
			return "", fmt.Errorf("chunk %d failed: %v", i, err)
		}
		results = append(results, result)
	}

	return strings.Join(results, "\n\n"), nil
}
