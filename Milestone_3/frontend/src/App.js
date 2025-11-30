import React, { useState, useEffect } from 'react'
import Home from './components/Home'
import DataDisplay from './components/DataDisplay'
import FormPage from './components/FormPage'
import Auth from './components/Auth'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUsername(data.username)
      } else {
        setIsAuthenticated(false)
        setUsername(null)
      }
    } catch (err) {
      setIsAuthenticated(false)
      setUsername(null)
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLogin = (user) => {
    setIsAuthenticated(true)
    setUsername(user)
    setCurrentPage('home')
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsAuthenticated(false)
      setUsername(null)
      setCurrentPage('home')
    }
  }

  if (checkingAuth) {
    return React.createElement('div', { className: 'app' },
      React.createElement('div', { className: 'main-content' },
        React.createElement('div', { className: 'page' }, 'Loading...')
      )
    )
  }

  if (!isAuthenticated) {
    return React.createElement('div', { className: 'app' },
      React.createElement('nav', { className: 'navbar' },
        React.createElement('h1', null, 'Job Suggestions App'),
        React.createElement('div', { className: 'nav-buttons' })
      ),
      React.createElement('main', { className: 'main-content' },
        React.createElement(Auth, { onLogin: handleLogin })
      )
    )
  }

  const pages = {
    home: React.createElement(Home, { username }),
    data: React.createElement(DataDisplay),
    form: React.createElement(FormPage)
  }

  return React.createElement('div', { className: 'app' },
    React.createElement('nav', { className: 'navbar' },
      React.createElement('h1', null, 'Job Suggestions App'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '1rem' } },
        React.createElement('div', { className: 'nav-buttons' },
          React.createElement('button', {
            onClick: () => setCurrentPage('home'),
            className: currentPage === 'home' ? 'active' : ''
          }, 'Home'),
          React.createElement('button', {
            onClick: () => setCurrentPage('data'),
            className: currentPage === 'data' ? 'active' : ''
          }, 'Data Display'),
          React.createElement('button', {
            onClick: () => setCurrentPage('form'),
            className: currentPage === 'form' ? 'active' : ''
          }, 'Form')
        ),
        React.createElement('div', { className: 'user-info' },
          React.createElement('span', null, username),
          React.createElement('button', {
            onClick: handleLogout,
            style: { backgroundColor: '#dc3545' }
          }, 'Logout')
        )
      )
    ),
    React.createElement('main', { className: 'main-content' },
      pages[currentPage]
    )
  )
}

export default App

