import React, { useState } from 'react'

function FormPage() {
  // State to store form data
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

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const data = await response.json()
      setResult(data)
      
      // Reset form after successful submission
      setFormData({
        workHistory: '',
        skills: '',
        personality: '',
        location: '',
        rolePreference: ''
      })
    } catch (err) {
      setError(err.message)
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
      React.createElement('pre', null, JSON.stringify(result, null, 2))
    )
  )
}

export default FormPage
