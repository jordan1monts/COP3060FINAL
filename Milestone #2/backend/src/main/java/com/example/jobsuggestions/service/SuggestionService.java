package com.example.jobsuggestions.service;

import com.example.jobsuggestions.model.Suggestion;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class SuggestionService {
    
    // In-memory storage using HashMap
    private Map<Long, Suggestion> storage = new HashMap<>();
    private AtomicLong idCounter = new AtomicLong(1);

    // Get all suggestions
    public List<Suggestion> getAllSuggestions() {
        return new ArrayList<>(storage.values());
    }

    // Get a suggestion by ID
    public Suggestion getSuggestionById(Long id) {
        return storage.get(id);
    }

    // Create a new suggestion
    public Suggestion createSuggestion(Map<String, String> answers) {
        Long id = idCounter.getAndIncrement();
        String suggestions = generateSuggestions(answers);
        Suggestion suggestion = new Suggestion(id, answers, suggestions);
        storage.put(id, suggestion);
        return suggestion;
    }

    // Update an existing suggestion
    public Suggestion updateSuggestion(Long id, Map<String, String> answers) {
        Suggestion suggestion = storage.get(id);
        if (suggestion != null) {
            suggestion.setAnswers(answers);
            suggestion.setSuggestions(generateSuggestions(answers));
            return suggestion;
        }
        return null;
    }

    // Delete a suggestion
    public boolean deleteSuggestion(Long id) {
        return storage.remove(id) != null;
    }

    // Generate simple suggestions based on answers
    private String generateSuggestions(Map<String, String> answers) {
        StringBuilder sb = new StringBuilder();
        sb.append("Job Suggestions:\n\n");
        
        String role = answers.getOrDefault("rolePreference", "General");
        String skills = answers.getOrDefault("skills", "");
        String location = answers.getOrDefault("location", "");
        
        sb.append("Based on your preferences:\n");
        sb.append("- Role: ").append(role).append("\n");
        sb.append("- Skills: ").append(skills).append("\n");
        sb.append("- Location: ").append(location).append("\n\n");
        
        sb.append("Recommended Positions:\n");
        sb.append("1. ").append(role).append(" - Matches your skills\n");
        sb.append("2. Senior ").append(role).append(" - Next step in career\n");
        sb.append("3. ").append(role).append(" Lead - Leadership role\n");
        
        return sb.toString();
    }
}

