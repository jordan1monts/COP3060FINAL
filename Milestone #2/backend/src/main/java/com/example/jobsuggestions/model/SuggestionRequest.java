package com.example.jobsuggestions.model;

import java.util.Map;

public class SuggestionRequest {
    private Map<String, String> answers;

    public Map<String, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, String> answers) {
        this.answers = answers;
    }
}

