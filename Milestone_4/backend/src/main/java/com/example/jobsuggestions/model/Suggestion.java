package com.example.jobsuggestions.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "suggestions")
@IdClass(SuggestionId.class)
public class Suggestion {
    @Id
    @Column(name = "user_id")
    private Long userId;
    
    @Id
    @Column(name = "entry_number")
    private Integer entryNumber; // User-specific entry number (1, 2, 3, etc. per user) - part of composite primary key
    
    @ElementCollection
    @CollectionTable(name = "suggestion_answers", joinColumns = {
        @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
        @JoinColumn(name = "entry_number", referencedColumnName = "entry_number")
    })
    @MapKeyColumn(name = "answer_key")
    @Column(name = "answer_value")
    private Map<String, String> answers = new HashMap<>();
    
    @Column(columnDefinition = "TEXT")
    private String suggestions;
    
    @Column(name = "external_api_data", columnDefinition = "TEXT")
    private String externalApiData;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private User user;
    
    // Helper method to set user and userId together
    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getId();
        }
    }

    public Suggestion() {
        this.createdAt = LocalDateTime.now();
    }

    public Suggestion(Map<String, String> answers, String suggestions, User user, Integer entryNumber) {
        this.answers = answers;
        this.suggestions = suggestions;
        this.user = user;
        this.userId = user.getId();
        this.entryNumber = entryNumber;
        this.createdAt = LocalDateTime.now();
    }
    
    // Convenience method to get composite ID
    public SuggestionId getId() {
        return new SuggestionId(userId, entryNumber);
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Integer getEntryNumber() {
        return entryNumber;
    }

    public void setEntryNumber(Integer entryNumber) {
        this.entryNumber = entryNumber;
    }
}

