import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileTabs from './FileTabs'
import { useActiveFileTabStore } from '../../../store/activeFileTabStore'

const A = { path: '/src/a.js', name: 'a.js', extension: 'js', value: '' }
const B = { path: '/src/b.js', name: 'b.js', extension: 'js', value: '' }

describe('FileTabs', () => {
  beforeEach(() => {
    useActiveFileTabStore.setState({ openTabs: [A, B], activeFileTab: A })
  })

  it('renders nothing when no tabs are open', () => {
    useActiveFileTabStore.setState({ openTabs: [], activeFileTab: null })
    const { container } = render(<FileTabs />)
    expect(container).toBeEmptyDOMElement()
  })

  it('activates a tab when clicked', async () => {
    render(<FileTabs />)
    await userEvent.click(screen.getByText('b.js'))
    expect(useActiveFileTabStore.getState().activeFileTab.path).toBe(B.path)
  })

  it('closes a tab from its close control without activating it', async () => {
    render(<FileTabs />)
    await userEvent.click(screen.getByRole('button', { name: /close b\.js/i }))
    const state = useActiveFileTabStore.getState()
    expect(state.openTabs.map((t) => t.path)).toEqual([A.path])
    expect(state.activeFileTab.path).toBe(A.path)
  })
})
