import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'

function Auth({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login')

  return React.createElement('div', { className: 'page auth-container' },
    React.createElement('h2', null, 'Authentication'),
    React.createElement('div', { className: 'auth-tabs' },
      React.createElement('button', {
        className: activeTab === 'login' ? 'active' : '',
        onClick: () => setActiveTab('login')
      }, 'Login'),
      React.createElement('button', {
        className: activeTab === 'register' ? 'active' : '',
        onClick: () => setActiveTab('register')
      }, 'Register')
    ),
    activeTab === 'login'
      ? React.createElement(Login, { onLogin })
      : React.createElement(Register, { onRegister: onLogin })
  )
}

export default Auth

