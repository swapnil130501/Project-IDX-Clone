import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'

const createProjectMutation = vi.fn()

vi.mock('../hooks/apis/mutations/useCreateProject', () => ({
  default: () => ({ createProjectMutation }),
}))

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/project/:projectId" element={<div>project workspace</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Landing', () => {
  beforeEach(() => {
    createProjectMutation.mockReset()
  })

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

  it('creates a project and navigates to it from the hero CTA', async () => {
    createProjectMutation.mockResolvedValue({ data: 'abc123' })
    renderLanding()
    await userEvent.click(screen.getByRole('button', { name: /start building/i }))
    expect(await screen.findByText('project workspace')).toBeInTheDocument()
  })

  it('creates a project and navigates to it from the header CTA', async () => {
    createProjectMutation.mockResolvedValue({ data: 'abc123' })
    renderLanding()
    await userEvent.click(screen.getByRole('button', { name: /new project/i }))
    expect(await screen.findByText('project workspace')).toBeInTheDocument()
  })

  it('shows an inline error and returns to the hero when creation fails', async () => {
    createProjectMutation.mockRejectedValue(new Error('network error'))
    renderLanding()
    await userEvent.click(screen.getByRole('button', { name: /start building/i }))
    expect(
      await screen.findByText(/couldn't create a project/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nimbus')
  })
})
