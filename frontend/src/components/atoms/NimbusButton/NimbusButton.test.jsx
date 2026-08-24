import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NimbusButton from './NimbusButton'

describe('NimbusButton', () => {
  it('renders its children and fires onClick', async () => {
    const onClick = vi.fn()
    render(<NimbusButton onClick={onClick}>Start building</NimbusButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Start building' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a ghost variant with a visible border', () => {
    render(<NimbusButton variant="ghost">New project</NimbusButton>)
    expect(screen.getByRole('button', { name: 'New project' }).className)
      .toContain('border-line')
  })
})
