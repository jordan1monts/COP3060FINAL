package com.example.jobsuggestions.controller;

import com.example.jobsuggestions.model.User;
import com.example.jobsuggestions.model.UserRequest;
import com.example.jobsuggestions.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

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
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpSession session) {
        String username = body.get("username");
        String password = body.get("password");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        User user = userOpt.get();
        
        // Store user in session
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        session.setMaxInactiveInterval(300); // 5 minutes

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "username", user.getUsername()
        ));
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }
        
        Long userId = (Long) session.getAttribute("userId");
        String username = (String) session.getAttribute("username");
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "username", username
        ));
    }
}

