import React, { useState } from 'react'
import ReadAloudButton from './ReadAloudButton'

function FormPage() {
  const [formData, setFormData] = useState({
    workHistory: '',
    skills: '',
    personality: '',
    location: '',
    rolePreference: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setResult(null)

    // Validate form
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value || value.trim() === '')
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(([key]) => {
        const labels = {
          workHistory: 'Work History',
          skills: 'Skills',
          personality: 'Personality Traits',
          location: 'Location Preference',
          rolePreference: 'Role Preference'
        }
        return labels[key] || key
      })
      const errorMsg = `Please fill in the following required fields: ${fieldNames.join(', ')}.`
      setError(errorMsg)
      setSubmitting(false)
      return
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 40000)

      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({
          answers: formData
        })
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = 'Failed to submit form. '
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage += errorData.error
          } else {
            errorMessage += `Server returned status ${response.status}.`
          }
        } catch (parseError) {
          errorMessage += `Server returned status ${response.status}: ${response.statusText}.`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setResult(data)
      
      setFormData({
        workHistory: '',
        skills: '',
        personality: '',
        location: '',
        rolePreference: ''
      })
    } catch (err) {
      let errorMessage = 'An error occurred while submitting the form. '
      if (err.name === 'AbortError') {
        errorMessage = 'Request timed out. The AI generation is taking longer than expected. Please check if the backend is running and try again. If the problem persists, the API may be experiencing high load.'
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldConfig = {
    workHistory: {
      label: 'Work History',
      type: 'textarea',
      placeholder: 'Describe your previous work experience, including job titles, companies, and key responsibilities.',
      helperText: 'Include details about your professional background, years of experience, and notable achievements.',
      ariaDescription: 'Enter your work history and professional experience'
    },
    skills: {
      label: 'Skills',
      type: 'text',
      placeholder: 'List your technical and soft skills (e.g., Java, Python, Communication, Leadership)',
      helperText: 'Separate multiple skills with commas. Include both technical skills and interpersonal abilities.',
      ariaDescription: 'Enter your professional skills'
    },
    personality: {
      label: 'Personality Traits',
      type: 'text',
      placeholder: 'Describe your personality (e.g., detail-oriented, creative, analytical, team player)',
      helperText: 'Mention traits that relate to your work style and professional interactions.',
      ariaDescription: 'Enter your personality traits'
    },
    location: {
      label: 'Location Preference',
      type: 'select',
      options: ['Remote', 'On-site', 'Hybrid'],
      helperText: 'Select your preferred work location arrangement.',
      ariaDescription: 'Select your location preference'
    },
    rolePreference: {
      label: 'Role Preference',
      type: 'text',
      placeholder: 'Specify your desired job role or title (e.g., Software Engineer, Data Analyst)',
      helperText: 'Enter the type of position you are seeking.',
      ariaDescription: 'Enter your preferred job role'
    }
  }

  const renderField = (fieldName, config) => {
    const value = formData[fieldName]
    const fieldId = fieldName

    return React.createElement('div', { 
      key: fieldName, 
      className: 'form-group',
      role: 'group',
      'aria-labelledby': `${fieldId}-label`
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
        React.createElement('label', {
          id: `${fieldId}-label`,
          htmlFor: fieldId
        }, config.label),
        React.createElement(ReadAloudButton, {
          text: `${config.label}. ${config.helperText}`,
          label: `Read aloud: ${config.label} instructions`
        })
      ),
      React.createElement('div', { className: 'form-field-wrapper' },
        config.type === 'textarea' 
          ? React.createElement('textarea', {
              id: fieldId,
              name: fieldName,
              value: value,
              onChange: handleChange,
              rows: '4',
              required: true,
              placeholder: config.placeholder,
              'aria-describedby': `${fieldId}-helper ${fieldId}-description`,
              'aria-label': config.ariaDescription
            })
          : config.type === 'select'
          ? React.createElement('select', {
              id: fieldId,
              name: fieldName,
              value: value,
              onChange: handleChange,
              required: true,
              'aria-describedby': `${fieldId}-helper ${fieldId}-description`,
              'aria-label': config.ariaDescription
            },
              React.createElement('option', { value: '' }, '-- Select an option --'),
              ...config.options.map(opt => 
                React.createElement('option', { key: opt, value: opt }, opt)
              )
            )
          : React.createElement('input', {
              type: 'text',
              id: fieldId,
              name: fieldName,
              value: value,
              onChange: handleChange,
              required: true,
              placeholder: config.placeholder,
              'aria-describedby': `${fieldId}-helper ${fieldId}-description`,
              'aria-label': config.ariaDescription
            })
      ),
      React.createElement('div', {
        id: `${fieldId}-helper`,
        className: 'helper-text',
        role: 'note'
      }, config.helperText),
      React.createElement('div', {
        id: `${fieldId}-description`,
        className: 'sr-only'
      }, config.ariaDescription)
    )
  }

  const instructionsText = 'Please fill out all fields below. All fields are required.'

  return React.createElement('div', { 
    className: 'page',
    role: 'main',
    'aria-labelledby': 'form-title'
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' } },
      React.createElement('h2', { id: 'form-title' }, 'Job Survey Form'),
      React.createElement(ReadAloudButton, {
        text: 'Job Survey Form. ' + instructionsText,
        label: 'Read aloud: Form title and instructions'
      })
    ),
    React.createElement('p', { className: 'form-instructions' },
      instructionsText
    ),
    React.createElement('form', { 
      onSubmit: handleSubmit,
      'aria-label': 'Job survey form',
      noValidate: true
    },
      ...Object.entries(fieldConfig).map(([fieldName, config]) => 
        renderField(fieldName, config)
      ),
      React.createElement('button', {
        type: 'submit',
        disabled: submitting,
        className: 'submit-btn',
        'aria-label': submitting ? 'Submitting form, please wait' : 'Submit survey form'
      }, submitting ? 'Submitting...' : 'Submit Survey')
    ),
    error && React.createElement('div', { 
      className: 'error-message',
      role: 'alert',
      'aria-live': 'assertive'
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
        React.createElement('strong', null, 'Error: '),
        React.createElement(ReadAloudButton, {
          text: error,
          label: 'Read aloud: Error message'
        }),
        React.createElement('span', null, error)
      )
    ),
    result && React.createElement('div', { 
      className: 'result-section',
      role: 'status',
      'aria-live': 'polite'
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
        React.createElement('h3', null, 'Submission Result'),
        React.createElement(ReadAloudButton, {
          text: 'Submission Result',
          label: 'Read aloud: Submission result heading'
        })
      ),
      React.createElement('p', null,
        React.createElement('strong', null, 'ID: '), result.id
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
        React.createElement('p', { style: { margin: 0 } },
          React.createElement('strong', null, 'Suggestions:')
        ),
        React.createElement(ReadAloudButton, {
          text: result.suggestions || 'N/A',
          label: 'Read aloud: Job suggestions'
        })
      ),
      React.createElement('pre', { 
        'aria-label': 'Job suggestions',
        tabIndex: 0
      }, result.suggestions || 'N/A'),
      result.externalApiData && React.createElement('div', { style: { marginTop: '1rem' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
          React.createElement('p', { style: { margin: 0 } },
            React.createElement('strong', null, 'External API Data:')
          ),
          React.createElement(ReadAloudButton, {
            text: typeof result.externalApiData === 'string' 
              ? result.externalApiData 
              : JSON.stringify(result.externalApiData, null, 2),
            label: 'Read aloud: External API data'
          })
        ),
        React.createElement('pre', { 
          style: { fontSize: '0.9rem' },
          'aria-label': 'External API integration details',
          tabIndex: 0
        },
          typeof result.externalApiData === 'string' 
            ? result.externalApiData 
            : JSON.stringify(result.externalApiData, null, 2)
        )
      )
    )
  )
}

export default FormPage
