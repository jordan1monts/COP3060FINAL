package com.example.jobsuggestions.repository;

import com.example.jobsuggestions.model.Suggestion;
import com.example.jobsuggestions.model.SuggestionId;
import com.example.jobsuggestions.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, SuggestionId> {
    List<Suggestion> findByUserOrderByEntryNumberAsc(User user);
    List<Suggestion> findByUserIdOrderByEntryNumberAsc(Long userId);
    Optional<Suggestion> findByUserIdAndEntryNumber(Long userId, Integer entryNumber);
}

