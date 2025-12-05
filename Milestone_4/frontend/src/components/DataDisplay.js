import React, { useState, useEffect } from 'react'
import ReadAloudButton from './ReadAloudButton'

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
      setError(null)
      
      const response = await fetch('/api/suggestions', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch data'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }
      
      const text = await response.text()
      if (!text || text.trim() === '') {
        setData([])
        setError(null)
        return
      }
      
      const result = JSON.parse(text)
      
      // Ensure result is an array
      if (Array.isArray(result)) {
        setData(result)
      } else {
        console.warn('Expected array but got:', result)
        setData([])
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'An error occurred while fetching data')
      setData([])
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
    return React.createElement('div', { 
      className: 'page',
      role: 'status',
      'aria-live': 'polite',
      'aria-label': 'Loading data'
    }, 'Loading...')
  }

  if (error) {
    return React.createElement('div', { 
      className: 'page',
      role: 'alert'
    },
      React.createElement('div', { 
        className: 'error',
        role: 'alert',
        'aria-live': 'assertive'
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
          React.createElement('strong', null, 'Error: '),
          React.createElement(ReadAloudButton, {
            text: error,
            label: 'Read aloud: Error message'
          })
        ),
        React.createElement('span', null, error)
      ),
      React.createElement('button', { 
        onClick: fetchData,
        'aria-label': 'Retry loading data'
      }, 'Try Again')
    )
  }

  return React.createElement('div', { 
    className: 'page',
    role: 'main',
    'aria-labelledby': 'data-title'
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' } },
      React.createElement('h2', { id: 'data-title' }, 'Job Suggestions Data'),
      React.createElement(ReadAloudButton, {
        text: 'Job Suggestions Data',
        label: 'Read aloud: Page title'
      })
    ),
    React.createElement('button', {
      onClick: fetchData,
      className: 'refresh-btn',
      'aria-label': 'Refresh data list'
    }, 'Refresh'),
    data.length === 0
      ? React.createElement('p', { 
          role: 'status',
          'aria-live': 'polite'
        }, 'No data available. Submit a form to create entries.')
      : React.createElement('div', { 
          className: 'data-list',
          role: 'list',
          'aria-label': `${data.length} job suggestion entries`
        },
          data.map((item, index) => {
            // Use entryNumber from database (user-specific), otherwise fall back to index
            const entryNumber = item.entryNumber || (index + 1)
            return React.createElement('article', { 
              key: item.id, 
              className: 'data-item',
              role: 'listitem',
              'aria-labelledby': `entry-${item.id}-title`
            },
              React.createElement('h3', { id: `entry-${item.id}-title` }, 'Entry #', entryNumber),
              React.createElement('p', null,
                React.createElement('strong', null, 'Created: '),
                React.createElement('time', { dateTime: item.createdAt || '' },
                  item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'
                )
              ),
              React.createElement('section', { 'aria-labelledby': `entry-${item.id}-answers` },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
                  React.createElement('p', { style: { margin: 0 } },
                    React.createElement('strong', { id: `entry-${item.id}-answers` }, 'Answers:')
                  ),
                  React.createElement(ReadAloudButton, {
                    text: JSON.stringify(item.answers, null, 2),
                    label: `Read aloud: Answers for entry ${index + 1}`
                  })
                ),
                React.createElement('pre', { 
                  'aria-label': 'Survey answers',
                  tabIndex: 0
                }, JSON.stringify(item.answers, null, 2))
              ),
              React.createElement('section', { 'aria-labelledby': `entry-${item.id}-suggestions` },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
                  React.createElement('p', { style: { margin: 0 } },
                    React.createElement('strong', { id: `entry-${item.id}-suggestions` }, 'Suggestions:')
                  ),
                  React.createElement(ReadAloudButton, {
                    text: item.suggestions || 'N/A',
                    label: `Read aloud: Job suggestions for entry ${index + 1}`
                  })
                ),
                React.createElement('pre', { 
                  style: { whiteSpace: 'pre-wrap' },
                  'aria-label': 'Job suggestions',
                  tabIndex: 0
                },
                  item.suggestions || 'N/A'
                )
              ),
              item.externalApiData && React.createElement('section', { 
                style: { marginTop: '0.5rem' },
                'aria-labelledby': `entry-${item.id}-api`
              },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
                  React.createElement('p', { style: { margin: 0 } },
                    React.createElement('strong', { id: `entry-${item.id}-api` }, 'External API Data:')
                  ),
                  React.createElement(ReadAloudButton, {
                    text: typeof item.externalApiData === 'string' 
                      ? item.externalApiData 
                      : JSON.stringify(item.externalApiData, null, 2),
                    label: `Read aloud: External API data for entry ${index + 1}`
                  })
                ),
                React.createElement('pre', { 
                  style: { fontSize: '0.85rem', maxHeight: '200px', overflow: 'auto' },
                  'aria-label': 'External API integration details',
                  tabIndex: 0
                },
                  typeof item.externalApiData === 'string' 
                    ? item.externalApiData 
                    : JSON.stringify(item.externalApiData, null, 2)
                )
              ),
              React.createElement('button', {
                onClick: () => handleDelete(item.entryNumber || entryNumber),
                className: 'delete-btn',
                'aria-label': `Delete entry number ${entryNumber}`
              }, 'Delete')
            )
          })
        )
  )
}

export default DataDisplay
