import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FormPage from '../components/FormPage'

// Simple mock for fetch
global.fetch = jest.fn()

describe('FormPage', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('renders form fields', () => {
    render(<FormPage />)
    
    expect(screen.getByLabelText(/work history/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/skills/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/personality traits/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/location preference/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/role preference/i)).toBeInTheDocument()
  })

  test('submits form with data', async () => {
    // Mock successful response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, answers: { skills: 'Java' } })
    })

    render(<FormPage />)

    // Fill out form
    fireEvent.change(screen.getByLabelText(/work history/i), {
      target: { value: '5 years' }
    })
    fireEvent.change(screen.getByLabelText(/skills/i), {
      target: { value: 'Java' }
    })
    fireEvent.change(screen.getByLabelText(/personality traits/i), {
      target: { value: 'Detail-oriented' }
    })
    fireEvent.change(screen.getByLabelText(/location preference/i), {
      target: { value: 'Remote' }
    })
    fireEvent.change(screen.getByLabelText(/role preference/i), {
      target: { value: 'Developer' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit survey/i }))

    // Check that fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })
  })

  test('displays error on failure', async () => {
    // Mock failed response
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<FormPage />)

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/work history/i), {
      target: { value: '5 years' }
    })
    fireEvent.change(screen.getByLabelText(/skills/i), {
      target: { value: 'Java' }
    })
    fireEvent.change(screen.getByLabelText(/personality traits/i), {
      target: { value: 'Detail-oriented' }
    })
    fireEvent.change(screen.getByLabelText(/location preference/i), {
      target: { value: 'Remote' }
    })
    fireEvent.change(screen.getByLabelText(/role preference/i), {
      target: { value: 'Developer' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit survey/i }))

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})

