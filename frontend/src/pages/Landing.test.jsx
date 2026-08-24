import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/new" element={<div>create project page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Landing', () => {
  it('shows the Nimbus wordmark and value prop', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nimbus')
    expect(
      screen.getByText(/full development environment in your browser/i)
    ).toBeInTheDocument()
  })

  it('renders three feature highlights', () => {
    renderLanding()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('navigates to /new from the hero CTA', async () => {
    renderLanding()
    await userEvent.click(screen.getByRole('button', { name: /start building/i }))
    expect(screen.getByText('create project page')).toBeInTheDocument()
  })

  it('navigates to /new from the header CTA', async () => {
    renderLanding()
    await userEvent.click(screen.getByRole('button', { name: /new project/i }))
    expect(screen.getByText('create project page')).toBeInTheDocument()
  })
})
