import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DataDisplay from '../components/DataDisplay'

// Simple mock for fetch
global.fetch = jest.fn()

describe('DataDisplay', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('fetches and displays data', async () => {
    // Mock successful response with data
    const mockData = [
      {
        id: 1,
        answers: { skills: 'Java' },
        suggestions: 'Test suggestions'
      }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    render(<DataDisplay />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/entry #1/i)).toBeInTheDocument()
    })
  })

  test('displays empty state when no data', async () => {
    // Mock empty response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<DataDisplay />)

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText(/no data available/i)).toBeInTheDocument()
    })
  })

  test('displays error on fetch failure', async () => {
    // Mock failed response
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<DataDisplay />)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})

