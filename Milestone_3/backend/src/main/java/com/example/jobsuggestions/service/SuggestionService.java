package com.example.jobsuggestions.service;

import com.example.jobsuggestions.model.Suggestion;
import com.example.jobsuggestions.model.User;
import com.example.jobsuggestions.repository.SuggestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SuggestionService {
    
    @Autowired
    private SuggestionRepository suggestionRepository;

    public List<Suggestion> getAllSuggestionsByUser(User user) {
        return suggestionRepository.findByUser(user);
    }

    public Suggestion getSuggestionById(Long id) {
        return suggestionRepository.findById(id).orElse(null);
    }

    @Transactional
    public Suggestion createSuggestion(User user, java.util.Map<String, String> answers) throws Exception {
        System.out.println("=== Creating suggestion with answers: " + answers);
        
        // MUST use AI - no fallback
        System.out.println("Generating AI suggestions...");
        String suggestions = generateJobSuggestionsWithAI(answers);
        String externalApiData = "{\"integration\": \"OpenAI ChatGPT API\", \"model\": \"" + MODEL + "\", \"status\": \"success\", \"aiGenerated\": true}";
        System.out.println("AI generation SUCCESS");
        
        Suggestion suggestion = new Suggestion(answers, suggestions, user);
        suggestion.setExternalApiData(externalApiData);
        
        Suggestion saved = suggestionRepository.save(suggestion);
        return saved;
    }

    public Suggestion updateSuggestion(Long id, java.util.Map<String, String> answers) throws Exception {
        Suggestion suggestion = suggestionRepository.findById(id).orElse(null);
        if (suggestion != null) {
            suggestion.setAnswers(answers);
            // MUST use AI - no fallback
            suggestion.setSuggestions(generateJobSuggestionsWithAI(answers));
            String externalApiData = fetchExternalApiData(answers);
            suggestion.setExternalApiData(externalApiData);
            return suggestionRepository.save(suggestion);
        }
        return null;
    }

    public boolean deleteSuggestion(Long id) {
        if (suggestionRepository.existsById(id)) {
            suggestionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private static final String OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
    private static final String MODEL = "openai/gpt-3.5-turbo"; // ChatGPT model via OpenRouter
    
    // Get API key from environment variable or use provided key
    // To use your own API key, set the OPENROUTER_API_KEY environment variable
    private String getApiKey() {
        String apiKey = System.getenv("OPENROUTER_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            // Default OpenRouter API key
            apiKey = "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";
        }
        return apiKey.trim();
    }


    private String generateJobSuggestionsWithAI(java.util.Map<String, String> answers) throws Exception {
        String apiKey = getApiKey();
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("API key not available");
        }

        System.out.println("Using API key: " + (apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "***"));
        System.out.println("Using model: " + MODEL);

        // Build prompt from user answers - emphasize using ALL information
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert career counselor. Analyze ALL of the user's survey responses below and produce personalized job suggestions.\n\n");
        prompt.append("IMPORTANT: You must consider ALL of the following information when making suggestions:\n");
        prompt.append("- Work History: Their past experience\n");
        prompt.append("- Skills: Their technical and soft skills\n");
        prompt.append("- Personality Traits: Their personality and work style\n");
        prompt.append("- Location Preference: Where they want to work\n");
        prompt.append("- Role Preference: Their desired role (but don't limit yourself to just this)\n\n");
        prompt.append("User's complete survey responses:\n");
        for (Map.Entry<String, String> entry : answers.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            // Make the labels more readable (convert camelCase to readable format)
            String readableKey = key.replaceAll("([A-Z])", " $1").trim();
            if (readableKey.isEmpty()) {
                readableKey = key;
            }
            prompt.append("- ").append(readableKey).append(": ").append(value).append("\n");
        }
        prompt.append("\nBased on ALL of the above information (work history, skills, personality, location, AND role preference), provide 5 diverse and personalized job role suggestions.\n");
        prompt.append("For each suggestion, include:\n");
        prompt.append("1. Job Title\n");
        prompt.append("2. Why this role matches their skills, experience, and personality\n");
        prompt.append("3. 2 practical next steps to pursue this role\n\n");
        prompt.append("Make the suggestions diverse and consider different career paths, not just variations of their role preference.");

        // Prepare request body for OpenRouter Chat Completions (OpenAI-compatible format)
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt.toString());
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(message);
        
        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL);
        body.put("messages", messages);
        body.put("max_tokens", 600);

        String requestJson = mapper.writeValueAsString(body);
        System.out.println("Making API request to: " + OPENROUTER_BASE_URL + "/chat/completions");
        System.out.println("Using API key prefix: " + (apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "***"));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(OPENROUTER_BASE_URL + "/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .header("HTTP-Referer", "http://localhost:5173")
                .header("X-Title", "Job Suggestions App")
                .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8))
                .timeout(java.time.Duration.ofSeconds(30))
                .build();
        
        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        System.out.println("API Response status: " + response.statusCode());
        String responseBody = response.body();
        System.out.println("API Response body (first 200 chars): " + (responseBody.length() > 200 ? responseBody.substring(0, 200) : responseBody));

        if (response.statusCode() != 200) {
            // Try to parse error message
            try {
                JsonNode errorNode = mapper.readTree(responseBody);
                if (errorNode.has("error") && errorNode.get("error").has("message")) {
                    String errorMsg = errorNode.get("error").get("message").asText();
                    throw new Exception("API request failed: " + errorMsg);
                }
            } catch (Exception e) {
                // If we can't parse, just use the status code
            }
            throw new Exception("API request failed with status: " + response.statusCode() + " - " + responseBody);
        }

        JsonNode jsonNode = mapper.readTree(responseBody);
        
        // Check for error in response
        if (jsonNode.has("error")) {
            JsonNode error = jsonNode.get("error");
            String errorMsg = error.has("message") ? error.get("message").asText() : error.toString();
            throw new Exception("API error: " + errorMsg);
        }
        
        if (jsonNode.has("choices") && jsonNode.get("choices").isArray() && jsonNode.get("choices").size() > 0) {
            JsonNode firstChoice = jsonNode.get("choices").get(0);
            if (firstChoice.has("message") && firstChoice.get("message").has("content")) {
                String content = firstChoice.get("message").get("content").asText();
                System.out.println("Successfully extracted AI response");
                return content;
            }
        }
        
        throw new Exception("Unexpected API response format: " + responseBody);
    }


    private String fetchExternalApiData(java.util.Map<String, String> answers) {
        // Store OpenAI API integration metadata
        try {
            String apiKey = getApiKey();
            String keyPrefix = apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "***";
            return String.format("{\"integration\": \"OpenAI ChatGPT API\", \"model\": \"%s\", \"apiKey\": \"%s\", \"status\": \"integrated\"}", 
                MODEL, keyPrefix);
        } catch (Exception e) {
            return "{\"integration\": \"OpenAI ChatGPT API\", \"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}";
        }
    }
}

