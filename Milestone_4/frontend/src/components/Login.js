import React, { useState } from 'react'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      onLogin(data.username)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return React.createElement('form', { onSubmit: handleSubmit },
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', { htmlFor: 'username' }, 'Username'),
      React.createElement('input', {
        type: 'text',
        id: 'username',
        value: username,
        onChange: (e) => setUsername(e.target.value),
        required: true
      })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', { htmlFor: 'password' }, 'Password'),
      React.createElement('input', {
        type: 'password',
        id: 'password',
        value: password,
        onChange: (e) => setPassword(e.target.value),
        required: true
      })
    ),
    React.createElement('button', {
      type: 'submit',
      disabled: loading
    }, loading ? 'Logging in...' : 'Login'),
    error && React.createElement('div', { className: 'error-message' }, error)
  )
}

export default Login

