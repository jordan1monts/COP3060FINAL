import React, { useRef } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

function ReadAloudButton({ text, label, className = '' }) {
  const { speechSynthesis } = useAccessibility()
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const utteranceRef = useRef(null)

  const handleClick = () => {
    if (!speechSynthesis) return

    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      utteranceRef.current = null
    } else {
      // Cancel any ongoing speech
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = 'en-US'
      
      utterance.onend = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }
      
      utteranceRef.current = utterance
      setIsSpeaking(true)
      speechSynthesis.speak(utterance)
    }
  }

  return React.createElement('button', {
    type: 'button',
    onClick: handleClick,
    className: `read-aloud-btn ${isSpeaking ? 'speaking' : ''} ${className}`,
    'aria-label': label || (isSpeaking ? 'Stop reading' : 'Read aloud'),
    title: isSpeaking ? 'Stop reading' : 'Read aloud',
    disabled: !speechSynthesis
  }, isSpeaking ? '⏹️' : '🔊')
}

export default ReadAloudButton

