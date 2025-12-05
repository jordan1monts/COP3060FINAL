import React, { useState, useEffect } from 'react'
import { AccessibilityProvider } from './context/AccessibilityContext'
import Home from './components/Home'
import DataDisplay from './components/DataDisplay'
import FormPage from './components/FormPage'
import Auth from './components/Auth'
import AccessibilityControls from './components/AccessibilityControls'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isAccessibilityCollapsed, setIsAccessibilityCollapsed] = useState(() => {
    return localStorage.getItem('accessibility-collapsed') === 'true'
  })

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
    return React.createElement(AccessibilityProvider, null,
      React.createElement('div', { className: 'app' },
        React.createElement('div', { className: 'main-content' },
          React.createElement('div', { className: 'page', role: 'status', 'aria-live': 'polite' }, 'Loading...')
        )
      )
    )
  }

  if (!isAuthenticated) {
    return React.createElement(AccessibilityProvider, null,
      React.createElement('div', { className: 'app' },
        React.createElement('nav', { className: 'navbar', role: 'navigation', 'aria-label': 'Main navigation' },
          React.createElement('h1', null, 'Job Suggestions App'),
          React.createElement('div', { className: 'nav-buttons' })
        ),
        React.createElement('main', { className: 'main-content', role: 'main' },
          React.createElement(Auth, { onLogin: handleLogin })
        )
      )
    )
  }

  const pages = {
    home: React.createElement(Home, { username }),
    data: React.createElement(DataDisplay),
    form: React.createElement(FormPage)
  }

  return React.createElement(AccessibilityProvider, null,
    React.createElement('div', { className: 'app' },
      React.createElement('nav', { className: 'navbar', role: 'navigation', 'aria-label': 'Main navigation' },
        React.createElement('h1', null, 'Job Suggestions App'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '1rem' } },
          React.createElement('div', { className: 'nav-buttons', role: 'menubar' },
            React.createElement('button', {
              onClick: () => setCurrentPage('home'),
              className: currentPage === 'home' ? 'active' : '',
              'aria-label': 'Navigate to home page',
              'aria-current': currentPage === 'home' ? 'page' : undefined
            }, 'Home'),
            React.createElement('button', {
              onClick: () => setCurrentPage('data'),
              className: currentPage === 'data' ? 'active' : '',
              'aria-label': 'Navigate to data display page',
              'aria-current': currentPage === 'data' ? 'page' : undefined
            }, 'Data Display'),
            React.createElement('button', {
              onClick: () => setCurrentPage('form'),
              className: currentPage === 'form' ? 'active' : '',
              'aria-label': 'Navigate to form page',
              'aria-current': currentPage === 'form' ? 'page' : undefined
            }, 'Form')
          ),
          React.createElement('div', { className: 'user-info', role: 'status', 'aria-live': 'polite' },
            React.createElement('span', { 'aria-label': `Logged in as ${username}` }, username),
            React.createElement('button', {
              onClick: handleLogout,
              style: { backgroundColor: '#dc3545' },
              'aria-label': 'Logout'
            }, 'Logout')
          )
        )
      ),
      React.createElement('main', { className: 'main-content', role: 'main' },
        React.createElement('aside', { 
          className: `accessibility-sidebar ${isAccessibilityCollapsed ? 'collapsed' : ''}`, 
          role: 'complementary', 
          'aria-label': 'Accessibility settings'
        },
          React.createElement('button', {
            className: 'accessibility-toggle',
            onClick: () => {
              const newState = !isAccessibilityCollapsed
              setIsAccessibilityCollapsed(newState)
              localStorage.setItem('accessibility-collapsed', newState.toString())
            },
            'aria-label': isAccessibilityCollapsed ? 'Expand accessibility options' : 'Collapse accessibility options',
            'aria-expanded': !isAccessibilityCollapsed
          }, isAccessibilityCollapsed ? '⚙️' : '✕'),
          !isAccessibilityCollapsed && React.createElement(AccessibilityControls)
        ),
        pages[currentPage]
      )
    )
  )
}

export default App
