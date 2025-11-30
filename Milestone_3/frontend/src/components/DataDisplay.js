import React, { useState, useEffect } from 'react'

function DataDisplay() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/suggestions', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch data')
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return
    }

    try {
      const response = await fetch(`/api/suggestions/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete')
      }

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
                React.createElement('strong', null, 'Created: '),
                item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'
              ),
              React.createElement('p', null,
                React.createElement('strong', null, 'Answers:')
              ),
              React.createElement('pre', null, JSON.stringify(item.answers, null, 2)),
              React.createElement('p', null,
                React.createElement('strong', null, 'Suggestions:')
              ),
              React.createElement('pre', { style: { whiteSpace: 'pre-wrap' } },
                item.suggestions || 'N/A'
              ),
              item.externalApiData && React.createElement('div', { style: { marginTop: '0.5rem' } },
                React.createElement('p', null,
                  React.createElement('strong', null, 'External API Data:')
                ),
                React.createElement('pre', { style: { fontSize: '0.85rem', maxHeight: '200px', overflow: 'auto' } },
                  typeof item.externalApiData === 'string' 
                    ? item.externalApiData 
                    : JSON.stringify(item.externalApiData, null, 2)
                )
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

