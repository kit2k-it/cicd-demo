import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders heading and pipeline visualizer', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'healthy',
            uptime: 120,
            timestamp: new Date().toISOString(),
          }),
      })
    )

    render(<App />)

    expect(screen.getByText(/NestJS \+ React Vite CI\/CD Lab/i)).toBeInTheDocument()
    expect(screen.getByText(/Continuous Integration \(CI\)/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/NestJS Backend: Hoạt động bình thường/i)).toBeInTheDocument()
    })
  })
})
