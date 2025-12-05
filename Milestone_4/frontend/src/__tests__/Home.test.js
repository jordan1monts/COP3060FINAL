import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../components/Home'

describe('Home', () => {
  test('renders home page content', () => {
    render(<Home />)
    
    expect(screen.getByText(/welcome to job suggestions/i)).toBeInTheDocument()
    expect(screen.getByText(/about this application/i)).toBeInTheDocument()
    expect(screen.getByText(/how to use/i)).toBeInTheDocument()
  })

  test('displays application information', () => {
    render(<Home />)
    
    expect(screen.getByText(/submit surveys to get job suggestions/i)).toBeInTheDocument()
    expect(screen.getByText(/view your saved suggestions/i)).toBeInTheDocument()
  })
})

