import React, { useState } from 'react'
import Home from './components/Home'
import DataDisplay from './components/DataDisplay'
import FormPage from './components/FormPage'

// You can add more pages here by importing them and adding to the pages object
// Example: import NewPage from './components/NewPage'

function App() {
  // State to control which page is displayed
  const [currentPage, setCurrentPage] = useState('home')

  // Object to map page names to components
  // Add new pages here by adding a new key-value pair
  const pages = {
    home: React.createElement(Home),
    data: React.createElement(DataDisplay),
    form: React.createElement(FormPage)
    // Add more pages here:
    // newPage: React.createElement(NewPage)
  }

  return React.createElement('div', { className: 'app' },
    React.createElement('nav', { className: 'navbar' },
      React.createElement('h1', null, 'Job Suggestions App'),
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
      )
    ),
    React.createElement('main', { className: 'main-content' },
      pages[currentPage]
    )
  )
}

export default App
