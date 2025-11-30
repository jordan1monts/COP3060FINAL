package com.example.jobsuggestions.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "suggestions")
public class Suggestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "suggestion_answers", joinColumns = @JoinColumn(name = "suggestion_id"))
    @MapKeyColumn(name = "question_key")
    @Column(name = "answer_value")
    private Map<String, String> answers = new HashMap<>();

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(name = "external_api_data", columnDefinition = "TEXT")
    private String externalApiData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public Suggestion() {
        this.createdAt = LocalDateTime.now();
    }

    public Suggestion(Map<String, String> answers, String suggestions, User user) {
        this.answers = answers;
        this.suggestions = suggestions;
        this.user = user;
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

    public String getExternalApiData() {
        return externalApiData;
    }

    public void setExternalApiData(String externalApiData) {
        this.externalApiData = externalApiData;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

