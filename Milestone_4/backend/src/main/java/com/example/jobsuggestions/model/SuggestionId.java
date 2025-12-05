package com.example.jobsuggestions.model;

import java.io.Serializable;
import java.util.Objects;

public class SuggestionId implements Serializable {
    private Long userId;
    private Integer entryNumber;

    public SuggestionId() {
    }

    public SuggestionId(Long userId, Integer entryNumber) {
        this.userId = userId;
        this.entryNumber = entryNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getEntryNumber() {
        return entryNumber;
    }

    public void setEntryNumber(Integer entryNumber) {
        this.entryNumber = entryNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SuggestionId that = (SuggestionId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(entryNumber, that.entryNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, entryNumber);
    }
}

