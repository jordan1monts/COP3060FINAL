import React from 'react'
import ReadAloudButton from './ReadAloudButton'

function Home({ username }) {
  const welcomeText = `Welcome to Job Suggestions. ${username ? `Hello, ${username}. ` : ''}This is the home dashboard for the Job Suggestions application.`
  const aboutText = 'About This Application. Submit surveys to get job suggestions. View your saved suggestions. Update or delete existing entries. Data is now persisted in a database. External API integration for enhanced suggestions.'
  const howToText = 'How to Use. Click Form to submit a new survey. Click Data Display to view all your suggestions. Use the navigation buttons to switch between pages.'

  return React.createElement('div', { 
    className: 'page',
    role: 'main',
    'aria-labelledby': 'home-title'
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' } },
      React.createElement('h2', { id: 'home-title' }, 'Welcome to Job Suggestions'),
      React.createElement(ReadAloudButton, {
        text: welcomeText,
        label: 'Read aloud: Welcome message'
      })
    ),
    username && React.createElement('p', { 
      style: { marginBottom: '1rem' },
      'aria-live': 'polite'
    },
      'Hello, ', React.createElement('strong', null, username), '!'
    ),
    React.createElement('p', null, 'This is the home dashboard for the Job Suggestions application.'),
    React.createElement('div', { 
      className: 'info-box',
      role: 'region',
      'aria-labelledby': 'about-heading'
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
        React.createElement('h3', { id: 'about-heading' }, 'About This Application'),
        React.createElement(ReadAloudButton, {
          text: aboutText,
          label: 'Read aloud: About this application'
        })
      ),
      React.createElement('ul', { role: 'list' },
        React.createElement('li', null, 'Submit surveys to get job suggestions'),
        React.createElement('li', null, 'View your saved suggestions'),
        React.createElement('li', null, 'Update or delete existing entries'),
        React.createElement('li', null, 'Data is now persisted in a database'),
        React.createElement('li', null, 'External API integration for enhanced suggestions')
      )
    ),
    React.createElement('div', { 
      className: 'info-box',
      role: 'region',
      'aria-labelledby': 'howto-heading'
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
        React.createElement('h3', { id: 'howto-heading' }, 'How to Use'),
        React.createElement(ReadAloudButton, {
          text: howToText,
          label: 'Read aloud: How to use instructions'
        })
      ),
      React.createElement('ol', { role: 'list' },
        React.createElement('li', null, 'Click "Form" to submit a new survey'),
        React.createElement('li', null, 'Click "Data Display" to view all your suggestions'),
        React.createElement('li', null, 'Use the navigation buttons to switch between pages')
      )
    )
  )
}

export default Home
