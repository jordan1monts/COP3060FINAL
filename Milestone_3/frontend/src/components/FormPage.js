import React, { useState } from 'react'

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setResult(null)

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit form')
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
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check if the backend is running and try again.')
      } else {
        setError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return React.createElement('div', { className: 'page' },
    React.createElement('h2', null, 'Job Survey Form'),
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'workHistory' }, 'Work History'),
        React.createElement('textarea', {
          id: 'workHistory',
          name: 'workHistory',
          value: formData.workHistory,
          onChange: handleChange,
          rows: '3',
          required: true
        })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'skills' }, 'Skills'),
        React.createElement('input', {
          type: 'text',
          id: 'skills',
          name: 'skills',
          value: formData.skills,
          onChange: handleChange,
          required: true
        })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'personality' }, 'Personality Traits'),
        React.createElement('input', {
          type: 'text',
          id: 'personality',
          name: 'personality',
          value: formData.personality,
          onChange: handleChange,
          required: true
        })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'location' }, 'Location Preference'),
        React.createElement('select', {
          id: 'location',
          name: 'location',
          value: formData.location,
          onChange: handleChange,
          required: true
        },
          React.createElement('option', { value: '' }, '-- Select --'),
          React.createElement('option', { value: 'Remote' }, 'Remote'),
          React.createElement('option', { value: 'On-site' }, 'On-site'),
          React.createElement('option', { value: 'Hybrid' }, 'Hybrid')
        )
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'rolePreference' }, 'Role Preference'),
        React.createElement('input', {
          type: 'text',
          id: 'rolePreference',
          name: 'rolePreference',
          value: formData.rolePreference,
          onChange: handleChange,
          required: true
        })
      ),
      React.createElement('button', {
        type: 'submit',
        disabled: submitting
      }, submitting ? 'Submitting...' : 'Submit Survey')
    ),
    error && React.createElement('div', { className: 'error-message' },
      'Error: ', error
    ),
    result && React.createElement('div', { className: 'result-section' },
      React.createElement('h3', null, 'Submission Result'),
      React.createElement('p', null,
        React.createElement('strong', null, 'ID: '), result.id
      ),
      React.createElement('p', null,
        React.createElement('strong', null, 'Suggestions:')
      ),
      React.createElement('pre', null, result.suggestions || 'N/A'),
      result.externalApiData && React.createElement('div', { style: { marginTop: '1rem' } },
        React.createElement('p', null,
          React.createElement('strong', null, 'External API Data:')
        ),
        React.createElement('pre', { style: { fontSize: '0.9rem' } },
          typeof result.externalApiData === 'string' 
            ? result.externalApiData 
            : JSON.stringify(result.externalApiData, null, 2)
        )
      )
    )
  )
}

export default FormPage

