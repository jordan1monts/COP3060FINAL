import React from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

function AccessibilityControls() {
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    textToSpeech,
    setTextToSpeech,
    stopSpeaking
  } = useAccessibility()

  const handleTextSizeChange = (size) => {
    setTextSize(size)
    stopSpeaking()
  }

  const handleContrastToggle = () => {
    setHighContrast(!highContrast)
    stopSpeaking()
  }

  const handleTTSToggle = () => {
    setTextToSpeech(!textToSpeech)
    if (textToSpeech) {
      stopSpeaking()
    }
  }

  return React.createElement('div', {
    className: 'accessibility-controls',
    role: 'region',
    'aria-label': 'Accessibility controls'
  },
    React.createElement('h3', null, 'Accessibility Options'),
    React.createElement('div', { className: 'accessibility-option' },
      React.createElement('label', {
        htmlFor: 'text-size',
        id: 'text-size-label'
      }, 'Text Size:'),
      React.createElement('div', { className: 'text-size-buttons', role: 'group', 'aria-labelledby': 'text-size-label' },
        React.createElement('button', {
          onClick: () => handleTextSizeChange('small'),
          className: textSize === 'small' ? 'active' : '',
          'aria-pressed': textSize === 'small',
          'aria-label': 'Small text size'
        }, 'Small'),
        React.createElement('button', {
          onClick: () => handleTextSizeChange('medium'),
          className: textSize === 'medium' ? 'active' : '',
          'aria-pressed': textSize === 'medium',
          'aria-label': 'Medium text size'
        }, 'Medium'),
        React.createElement('button', {
          onClick: () => handleTextSizeChange('large'),
          className: textSize === 'large' ? 'active' : '',
          'aria-pressed': textSize === 'large',
          'aria-label': 'Large text size'
        }, 'Large'),
        React.createElement('button', {
          onClick: () => handleTextSizeChange('xlarge'),
          className: textSize === 'xlarge' ? 'active' : '',
          'aria-pressed': textSize === 'xlarge',
          'aria-label': 'Extra large text size'
        }, 'Extra Large')
      )
    ),
    React.createElement('div', { className: 'accessibility-option' },
      React.createElement('label', {
        htmlFor: 'high-contrast',
        className: 'toggle-label'
      },
        React.createElement('input', {
          type: 'checkbox',
          id: 'high-contrast',
          checked: highContrast,
          onChange: handleContrastToggle,
          'aria-label': 'Enable high contrast mode'
        }),
        React.createElement('span', null, 'High Contrast Mode')
      )
    ),
    React.createElement('div', { className: 'accessibility-option' },
      React.createElement('p', { style: { fontSize: '0.9rem', color: '#666', margin: 0 } },
        '💡 Click the 🔊 button next to any text to hear it read aloud.'
      )
    )
  )
}

export default AccessibilityControls

