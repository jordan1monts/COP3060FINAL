import React, { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

export const AccessibilityProvider = ({ children }) => {
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('accessibility-textSize') || 'medium'
  })
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('accessibility-highContrast') === 'true'
  })
  const [textToSpeech, setTextToSpeech] = useState(() => {
    return localStorage.getItem('accessibility-textToSpeech') === 'true'
  })
  const [speechSynthesis, setSpeechSynthesis] = useState(null)

  useEffect(() => {
    localStorage.setItem('accessibility-textSize', textSize)
  }, [textSize])

  useEffect(() => {
    localStorage.setItem('accessibility-highContrast', highContrast.toString())
    document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'normal')
  }, [highContrast])

  useEffect(() => {
    localStorage.setItem('accessibility-textToSpeech', textToSpeech.toString())
  }, [textToSpeech])

  useEffect(() => {
    // Set text size class on document root
    document.documentElement.setAttribute('data-text-size', textSize)
  }, [textSize])

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [])

  const speak = (text, options = {}) => {
    if (!speechSynthesis) return
    
    // Cancel any ongoing speech
    speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options.rate || 1.0
    utterance.pitch = options.pitch || 1.0
    utterance.volume = options.volume || 1.0
    utterance.lang = options.lang || 'en-US'
    
    if (options.onEnd) {
      utterance.onend = options.onEnd
    } else {
      // Default onend handler
      utterance.onend = () => {
        // Speech finished
      }
    }
    
    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
  }

  const value = {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    textToSpeech,
    setTextToSpeech,
    speak,
    stopSpeaking,
    speechSynthesis
  }

  return React.createElement(
    AccessibilityContext.Provider,
    { value },
    children
  )
}

