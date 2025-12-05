package com.example.jobsuggestions.service;

import com.example.jobsuggestions.model.Suggestion;
import com.example.jobsuggestions.model.SuggestionId;
import com.example.jobsuggestions.model.User;
import com.example.jobsuggestions.repository.SuggestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SuggestionServiceTest {

    @Mock
    private SuggestionRepository suggestionRepository;

    @InjectMocks
    private SuggestionService suggestionService;

    private User testUser;
    private Suggestion testSuggestion;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        Map<String, String> answers = new HashMap<>();
        answers.put("skills", "Java");
        
        testSuggestion = new Suggestion();
        testSuggestion.setUserId(1L);
        testSuggestion.setEntryNumber(1); // Set user-specific entry number
        testSuggestion.setAnswers(answers);
        testSuggestion.setSuggestions("Test suggestions");
        testSuggestion.setUser(testUser);
    }

    @Test
    void testGetAllSuggestionsByUser_EmptyList() {
        // Test getting all suggestions when list is empty
        when(suggestionRepository.findByUserOrderByEntryNumberAsc(testUser)).thenReturn(new ArrayList<>());
        
        List<Suggestion> result = suggestionService.getAllSuggestionsByUser(testUser);
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    @Test
    void testGetAllSuggestionsByUser_WithSuggestions() {
        // Test getting all suggestions for a user
        List<Suggestion> suggestions = new ArrayList<>();
        suggestions.add(testSuggestion);
        when(suggestionRepository.findByUserOrderByEntryNumberAsc(testUser)).thenReturn(suggestions);
        
        List<Suggestion> result = suggestionService.getAllSuggestionsByUser(testUser);
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSuggestion.getUserId(), result.get(0).getUserId());
        assertEquals(testSuggestion.getEntryNumber(), result.get(0).getEntryNumber());
    }

    @Test
    void testGetSuggestionById() {
        // Test getting a suggestion by userId and entryNumber
        when(suggestionRepository.findByUserIdAndEntryNumber(1L, 1)).thenReturn(Optional.of(testSuggestion));

        Suggestion result = suggestionService.getSuggestionById(1L, 1);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals(1, result.getEntryNumber());
        assertEquals("Java", result.getAnswers().get("skills"));
    }

    @Test
    void testGetSuggestionById_NotFound() {
        // Test getting a suggestion that doesn't exist
        when(suggestionRepository.findByUserIdAndEntryNumber(999L, 1)).thenReturn(Optional.empty());

        Suggestion result = suggestionService.getSuggestionById(999L, 1);

        assertNull(result);
    }

    @Test
    void testDeleteSuggestion() {
        // Test deleting a suggestion
        SuggestionId id = new SuggestionId(1L, 1);
        when(suggestionRepository.existsById(id)).thenReturn(true);
        doNothing().when(suggestionRepository).deleteById(id);

        boolean deleted = suggestionService.deleteSuggestion(1L, 1);
        assertTrue(deleted);
        
        verify(suggestionRepository).existsById(id);
        verify(suggestionRepository).deleteById(id);
    }

    @Test
    void testDeleteSuggestion_NotFound() {
        // Test deleting a suggestion that doesn't exist
        SuggestionId id = new SuggestionId(999L, 1);
        when(suggestionRepository.existsById(id)).thenReturn(false);

        boolean deleted = suggestionService.deleteSuggestion(999L, 1);
        assertFalse(deleted);
        
        verify(suggestionRepository).existsById(id);
        verify(suggestionRepository, never()).deleteById(any());
    }
}
