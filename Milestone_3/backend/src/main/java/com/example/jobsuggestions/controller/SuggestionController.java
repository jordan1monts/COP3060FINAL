package com.example.jobsuggestions.controller;

import com.example.jobsuggestions.model.Suggestion;
import com.example.jobsuggestions.model.SuggestionRequest;
import com.example.jobsuggestions.model.User;
import com.example.jobsuggestions.repository.UserRepository;
import com.example.jobsuggestions.service.SuggestionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SuggestionController {

    @Autowired
    private SuggestionService suggestionService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(HttpSession session) {
        if (session == null) {
            return null;
        }
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return null;
        }
        return userRepository.findById(userId).orElse(null);
    }

    // GET /api/suggestions - Get all suggestions for current user
    @GetMapping("/suggestions")
    public ResponseEntity<?> getAllSuggestions(HttpSession session) {
        User user = getCurrentUser(session);
        if (user == null) {
            // Return empty list - user can access page, so just return empty
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Suggestion> suggestions = suggestionService.getAllSuggestionsByUser(user);
        return ResponseEntity.ok(suggestions);
    }

    // GET /api/suggestions/{id} - Get a specific suggestion
    @GetMapping("/suggestions/{id}")
    public ResponseEntity<?> getSuggestionById(@PathVariable Long id, HttpSession session) {
        User user = getCurrentUser(session);
        Suggestion suggestion = suggestionService.getSuggestionById(id);
        
        if (suggestion == null) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Suggestion not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Only check user ownership if user is logged in
        if (user != null && !suggestion.getUser().getId().equals(user.getId())) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Access denied");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        return ResponseEntity.ok(suggestion);
    }

    // POST /api/suggestions - Create a new suggestion
    @PostMapping("/suggestions")
    public ResponseEntity<?> createSuggestion(@RequestBody SuggestionRequest request, HttpSession session) {
        try {
            if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Answers cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Get user from session
            User user = getCurrentUser(session);
            
            // If no user, session expired - extend it and return error
            if (user == null) {
                if (session != null) {
                    session.setMaxInactiveInterval(300); // Reset to 5 minutes
                }
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Session expired. Please log in again.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            Suggestion created = suggestionService.createSuggestion(user, request.getAnswers());
            
            // Return response without user to avoid lazy loading issues
            HashMap<String, Object> response = new HashMap<>();
            response.put("id", created.getId());
            response.put("answers", created.getAnswers());
            response.put("suggestions", created.getSuggestions());
            response.put("externalApiData", created.getExternalApiData());
            response.put("createdAt", created.getCreatedAt());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "AI generation failed: " + e.getMessage());
            System.err.println("Error creating suggestion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // PUT /api/suggestions/{id} - Update a suggestion
    @PutMapping("/suggestions/{id}")
    public ResponseEntity<?> updateSuggestion(@PathVariable Long id, @RequestBody SuggestionRequest request, HttpSession session) {
        try {
            User user = getCurrentUser(session);
            Suggestion existing = suggestionService.getSuggestionById(id);
            
            if (existing == null) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Suggestion not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            // Check ownership if user is logged in
            if (user != null && !existing.getUser().getId().equals(user.getId())) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Access denied");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Answers cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Suggestion updated = suggestionService.updateSuggestion(id, request.getAnswers());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE /api/suggestions/{id} - Delete a suggestion
    @DeleteMapping("/suggestions/{id}")
    public ResponseEntity<?> deleteSuggestion(@PathVariable Long id, HttpSession session) {
        User user = getCurrentUser(session);
        Suggestion existing = suggestionService.getSuggestionById(id);
        
        if (existing != null && user != null && !existing.getUser().getId().equals(user.getId())) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Access denied");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        boolean deleted = suggestionService.deleteSuggestion(id);
        
        if (deleted) {
            HashMap<String, String> message = new HashMap<>();
            message.put("message", "Suggestion deleted successfully");
            return ResponseEntity.ok(message);
        } else {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Suggestion not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}

