package com.example.jobsuggestions.model;

import java.time.LocalDateTime;
import java.util.Map;

public class Suggestion {
    private Long id;
    private Map<String, String> answers;
    private String suggestions;
    private LocalDateTime createdAt;

    public Suggestion() {
        this.createdAt = LocalDateTime.now();
    }

    public Suggestion(Long id, Map<String, String> answers, String suggestions) {
        this.id = id;
        this.answers = answers;
        this.suggestions = suggestions;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Map<String, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, String> answers) {
        this.answers = answers;
    }

    public String getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(String suggestions) {
        this.suggestions = suggestions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

