import React from 'react'

function Home({ username }) {
  return React.createElement('div', { className: 'page' },
    React.createElement('h2', null, 'Welcome to Job Suggestions'),
    username && React.createElement('p', { style: { marginBottom: '1rem' } },
      'Hello, ', React.createElement('strong', null, username), '!'
    ),
    React.createElement('p', null, 'This is the home dashboard for the Job Suggestions application.'),
    React.createElement('div', { className: 'info-box' },
      React.createElement('h3', null, 'About This Application'),
      React.createElement('ul', null,
        React.createElement('li', null, 'Submit surveys to get job suggestions'),
        React.createElement('li', null, 'View your saved suggestions'),
        React.createElement('li', null, 'Update or delete existing entries'),
        React.createElement('li', null, 'Data is now persisted in a database'),
        React.createElement('li', null, 'External API integration for enhanced suggestions')
      )
    ),
    React.createElement('div', { className: 'info-box' },
      React.createElement('h3', null, 'How to Use'),
      React.createElement('ol', null,
        React.createElement('li', null, 'Click "Form" to submit a new survey'),
        React.createElement('li', null, 'Click "Data Display" to view all your suggestions'),
        React.createElement('li', null, 'Use the navigation buttons to switch between pages')
      )
    )
  )
}

export default Home

