package com.example.jobsuggestions.controller;

import com.example.jobsuggestions.model.Suggestion;
import com.example.jobsuggestions.model.SuggestionRequest;
import com.example.jobsuggestions.model.User;
import com.example.jobsuggestions.repository.UserRepository;
import com.example.jobsuggestions.service.SuggestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
    controllers = SuggestionController.class,
    excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class
    },
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
            com.example.jobsuggestions.config.SecurityConfig.class,
            com.example.jobsuggestions.config.UserDetailsConfig.class,
            com.example.jobsuggestions.config.ApplicationSecurityBeans.class
        })
    }
)
class SuggestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SuggestionService suggestionService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Suggestion testSuggestion;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        Map<String, String> answers = new HashMap<>();
        answers.put("skills", "Java");
        
        testSuggestion = new Suggestion();
        testSuggestion.setUserId(1L);
        testSuggestion.setEntryNumber(1);
        testSuggestion.setAnswers(answers);
        testSuggestion.setSuggestions("Test suggestions");
        testSuggestion.setUser(testUser);
    }

    @Test
    void testGetAllSuggestions() throws Exception {
        List<Suggestion> suggestions = new ArrayList<>();
        suggestions.add(testSuggestion);
        
        // Mock session with user
        HttpSession mockSession = mock(HttpSession.class);
        when(mockSession.getAttribute("userId")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(suggestionService.getAllSuggestionsByUser(testUser)).thenReturn(suggestions);

        mockMvc.perform(get("/api/suggestions")
                        .sessionAttr("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].entryNumber").value(1))
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testCreateSuggestion() throws Exception {
        // Mock session with user
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(suggestionService.createSuggestion(any(User.class), any(Map.class))).thenReturn(testSuggestion);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, String> answers = new HashMap<>();
        answers.put("skills", "Java");
        requestBody.put("answers", answers);

        mockMvc.perform(post("/api/suggestions")
                        .sessionAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.entryNumber").value(1))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testUpdateSuggestion() throws Exception {
        Map<String, String> updatedAnswers = new HashMap<>();
        updatedAnswers.put("skills", "TypeScript");
        
        Suggestion updatedSuggestion = new Suggestion();
        updatedSuggestion.setUserId(1L);
        updatedSuggestion.setEntryNumber(1);
        updatedSuggestion.setAnswers(updatedAnswers);
        updatedSuggestion.setSuggestions("Updated suggestions");
        updatedSuggestion.setUser(testUser);

        // Mock session with user
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        // Mock existing suggestion
        when(suggestionService.getSuggestionById(1L, 1)).thenReturn(testSuggestion);
        // Mock update
        when(suggestionService.updateSuggestion(eq(1L), eq(1), any(Map.class))).thenReturn(updatedSuggestion);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("answers", updatedAnswers);

        mockMvc.perform(put("/api/suggestions/1")
                        .sessionAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entryNumber").value(1))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.answers.skills").value("TypeScript"));
    }

    @Test
    void testDeleteSuggestion() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(suggestionService.deleteSuggestion(1L, 1)).thenReturn(true);

        mockMvc.perform(delete("/api/suggestions/1")
                        .sessionAttr("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Suggestion deleted successfully"));
    }
}

