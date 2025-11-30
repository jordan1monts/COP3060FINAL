import React, { useState } from 'react'

function Register({ onRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess('Registration successful!')
      setUsername('')
      setPassword('')
      
      // Automatically log in after registration
      onRegister(data.username)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return React.createElement('form', { onSubmit: handleSubmit },
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', { htmlFor: 'reg-username' }, 'Username'),
      React.createElement('input', {
        type: 'text',
        id: 'reg-username',
        value: username,
        onChange: (e) => setUsername(e.target.value),
        required: true
      })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', { htmlFor: 'reg-password' }, 'Password (min 3 characters)'),
      React.createElement('input', {
        type: 'password',
        id: 'reg-password',
        value: password,
        onChange: (e) => setPassword(e.target.value),
        required: true,
        minLength: 3
      })
    ),
    React.createElement('button', {
      type: 'submit',
      disabled: loading
    }, loading ? 'Registering...' : 'Register'),
    error && React.createElement('div', { className: 'error-message' }, error),
    success && React.createElement('div', { className: 'success-message' }, success)
  )
}

export default Register

