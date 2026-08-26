import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Router } from './Router'

vi.mock('./hooks/apis/mutations/useCreateProject', () => ({
  default: () => ({ createProjectMutation: vi.fn() }),
}))

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Router />
    </MemoryRouter>
  )
}

describe('Router', () => {
  it('renders the Nimbus landing page at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nimbus')
  })
})
