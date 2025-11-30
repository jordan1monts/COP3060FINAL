package com.example.jobsuggestions.controller;

import com.example.jobsuggestions.model.User;
import com.example.jobsuggestions.model.UserRequest;
import com.example.jobsuggestions.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest request, HttpSession session) {
        try {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Username cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (request.getPassword() == null || request.getPassword().length() < 3) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Password must be at least 3 characters");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = userService.registerUser(request.getUsername(), request.getPassword());
            
            // Automatically log the user in after registration
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            session.setMaxInactiveInterval(300); // 5 minutes
            
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("username", user.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest request, HttpSession session) {
        try {
            Optional<User> userOpt = userService.findByUsername(request.getUsername());
            
            if (userOpt.isEmpty()) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            User user = userOpt.get();
            
            if (!userService.validatePassword(request.getPassword(), user.getPassword())) {
                HashMap<String, String> error = new HashMap<>();
                error.put("error", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Store user in session
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            session.setMaxInactiveInterval(300); // 5 minutes

            HashMap<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        HashMap<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        if (session == null) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        Long userId = (Long) session.getAttribute("userId");
        String username = (String) session.getAttribute("username");
        
        if (userId == null) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", "Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        HashMap<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("username", username);
        return ResponseEntity.ok(response);
    }
}

