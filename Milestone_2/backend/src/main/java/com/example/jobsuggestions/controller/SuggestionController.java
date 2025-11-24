package com.example.jobsuggestions.controller;

import com.example.jobsuggestions.model.Suggestion;
import com.example.jobsuggestions.model.SuggestionRequest;
import com.example.jobsuggestions.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SuggestionController {

    @Autowired
    private SuggestionService suggestionService;

    // GET /api/suggestions - Get all suggestions
    @GetMapping("/suggestions")
    public ResponseEntity<List<Suggestion>> getAllSuggestions() {
        List<Suggestion> suggestions = suggestionService.getAllSuggestions();
        return ResponseEntity.ok(suggestions);
    }

    // GET /api/suggestions/{id} - Get a specific suggestion
    @GetMapping("/suggestions/{id}")
    public ResponseEntity<?> getSuggestionById(@PathVariable Long id) {
        Suggestion suggestion = suggestionService.getSuggestionById(id);
        
        if (suggestion != null) {
            return ResponseEntity.ok(suggestion);
        } else {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Suggestion not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // POST /api/suggestions - Create a new suggestion
    @PostMapping("/suggestions")
    public ResponseEntity<?> createSuggestion(@RequestBody SuggestionRequest request) {
        try {
            if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Answers cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Suggestion created = suggestionService.createSuggestion(request.getAnswers());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // PUT /api/suggestions/{id} - Update a suggestion
    @PutMapping("/suggestions/{id}")
    public ResponseEntity<?> updateSuggestion(@PathVariable Long id, @RequestBody SuggestionRequest request) {
        try {
            if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Answers cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Suggestion updated = suggestionService.updateSuggestion(id, request.getAnswers());
            
            if (updated != null) {
                return ResponseEntity.ok(updated);
            } else {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Suggestion not found with id: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE /api/suggestions/{id} - Delete a suggestion
    @DeleteMapping("/suggestions/{id}")
    public ResponseEntity<?> deleteSuggestion(@PathVariable Long id) {
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

