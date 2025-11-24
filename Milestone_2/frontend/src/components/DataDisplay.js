import React, { useState, useEffect } from 'react'

function DataDisplay() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data when component loads
  useEffect(() => {
    fetchData()
  }, [])

  // Function to fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/suggestions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Function to delete a suggestion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return
    }

    try {
      const response = await fetch(`/api/suggestions/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      // Refresh the data after deletion
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return React.createElement('div', { className: 'page' }, 'Loading...')
  }

  if (error) {
    return React.createElement('div', { className: 'page' },
      React.createElement('div', { className: 'error' }, 'Error: ', error),
      React.createElement('button', { onClick: fetchData }, 'Try Again')
    )
  }

  return React.createElement('div', { className: 'page' },
    React.createElement('h2', null, 'Job Suggestions Data'),
    React.createElement('button', {
      onClick: fetchData,
      className: 'refresh-btn'
    }, 'Refresh'),
    data.length === 0
      ? React.createElement('p', null, 'No data available. Submit a form to create entries.')
      : React.createElement('div', { className: 'data-list' },
          data.map((item) =>
            React.createElement('div', { key: item.id, className: 'data-item' },
              React.createElement('h3', null, 'Entry #', item.id),
              React.createElement('p', null,
                React.createElement('strong', null, 'Answers:')
              ),
              React.createElement('pre', null, JSON.stringify(item.answers, null, 2)),
              React.createElement('p', null,
                React.createElement('strong', null, 'Suggestions:'), ' ',
                item.suggestions || 'N/A'
              ),
              React.createElement('button', {
                onClick: () => handleDelete(item.id),
                className: 'delete-btn'
              }, 'Delete')
            )
          )
        )
  )
}

export default DataDisplay
