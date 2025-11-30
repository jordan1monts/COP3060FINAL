package com.example.jobsuggestions.repository;

import com.example.jobsuggestions.model.Suggestion;
import com.example.jobsuggestions.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    List<Suggestion> findByUser(User user);
    List<Suggestion> findByUserId(Long userId);
}

