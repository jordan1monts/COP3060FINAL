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
        
        // Return suggestions with user-specific entry numbers from database
        List<HashMap<String, Object>> response = new ArrayList<>();
        for (Suggestion suggestion : suggestions) {
            HashMap<String, Object> item = new HashMap<>();
            item.put("userId", suggestion.getUserId());
            item.put("entryNumber", suggestion.getEntryNumber()); // User-specific entry number (this is the ID)
            item.put("id", suggestion.getEntryNumber()); // For backward compatibility, entryNumber is the ID
            item.put("answers", suggestion.getAnswers());
            item.put("suggestions", suggestion.getSuggestions());
            item.put("externalApiData", suggestion.getExternalApiData());
            item.put("createdAt", suggestion.getCreatedAt());
            response.add(item);
        }
        
        return ResponseEntity.ok(response);
    }

    // GET /api/suggestions/{entryNumber} - Get a specific suggestion by entry number
    @GetMapping("/suggestions/{entryNumber}")
    public ResponseEntity<?> getSuggestionByEntryNumber(@PathVariable Integer entryNumber, HttpSession session) {
        User user = getCurrentUser(session);
        
        if (user == null) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        Suggestion suggestion = suggestionService.getSuggestionById(user.getId(), entryNumber);
        
        if (suggestion == null) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Suggestion not found with entry number: " + entryNumber);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Return response without user to avoid lazy loading issues
        HashMap<String, Object> response = new HashMap<>();
        response.put("userId", suggestion.getUserId());
        response.put("entryNumber", suggestion.getEntryNumber()); // User-specific entry number (this is the ID)
        response.put("id", suggestion.getEntryNumber()); // For backward compatibility, entryNumber is the ID
        response.put("answers", suggestion.getAnswers());
        response.put("suggestions", suggestion.getSuggestions());
        response.put("externalApiData", suggestion.getExternalApiData());
        response.put("createdAt", suggestion.getCreatedAt());
        
        return ResponseEntity.ok(response);
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
            response.put("userId", created.getUserId());
            response.put("entryNumber", created.getEntryNumber()); // User-specific entry number (this is the ID)
            response.put("id", created.getEntryNumber()); // For backward compatibility, entryNumber is the ID
            response.put("answers", created.getAnswers());
            response.put("suggestions", created.getSuggestions());
            response.put("externalApiData", created.getExternalApiData());
            response.put("createdAt", created.getCreatedAt());
            
            // Also set user relationship for the created object
            created.setUser(user);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "AI generation failed: " + e.getMessage());
            System.err.println("Error creating suggestion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // PUT /api/suggestions/{entryNumber} - Update a suggestion
    @PutMapping("/suggestions/{entryNumber}")
    public ResponseEntity<?> updateSuggestion(@PathVariable Integer entryNumber, @RequestBody SuggestionRequest request, HttpSession session) {
        try {
            User user = getCurrentUser(session);
            
            if (user == null) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Authentication required");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            Suggestion existing = suggestionService.getSuggestionById(user.getId(), entryNumber);
            
            if (existing == null) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Suggestion not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Answers cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Suggestion updated = suggestionService.updateSuggestion(user.getId(), entryNumber, request.getAnswers());
            
            // Return response without user to avoid lazy loading issues
            HashMap<String, Object> response = new HashMap<>();
            response.put("userId", updated.getUserId());
            response.put("entryNumber", updated.getEntryNumber()); // User-specific entry number (this is the ID)
            response.put("id", updated.getEntryNumber()); // For backward compatibility, entryNumber is the ID
            response.put("answers", updated.getAnswers());
            response.put("suggestions", updated.getSuggestions());
            response.put("externalApiData", updated.getExternalApiData());
            response.put("createdAt", updated.getCreatedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE /api/suggestions/{entryNumber} - Delete a suggestion
    @DeleteMapping("/suggestions/{entryNumber}")
    public ResponseEntity<?> deleteSuggestion(@PathVariable Integer entryNumber, HttpSession session) {
        User user = getCurrentUser(session);
        
        if (user == null) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        boolean deleted = suggestionService.deleteSuggestion(user.getId(), entryNumber);
        
        if (deleted) {
            HashMap<String, String> message = new HashMap<>();
            message.put("message", "Suggestion deleted successfully");
            return ResponseEntity.ok(message);
        } else {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Suggestion not found with entry number: " + entryNumber);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}

