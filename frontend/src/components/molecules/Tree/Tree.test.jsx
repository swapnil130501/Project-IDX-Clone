import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tree from './Tree'
import { useExpandTreeStore } from '../../../store/expandTreeStore'
import { useEditorSocketStore } from '../../../store/editorSocketStore'

const DATA = {
  name: 'src',
  path: '/src',
  children: [
    { name: 'index.js', path: '/src/index.js' },
    { name: 'App.jsx', path: '/src/App.jsx' },
  ],
}

describe('Tree', () => {
  beforeEach(() => {
    useExpandTreeStore.setState({ expand: {} })
    useEditorSocketStore.setState({ editorSocket: { emit: vi.fn() } })
  })

  it('hides children until the folder is expanded', async () => {
    render(<Tree data={DATA} />)
    expect(screen.queryByText('index.js')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /src/ }))
    expect(await screen.findByText('index.js')).toBeInTheDocument()
  })

  it('emits readFile when a file row is clicked', async () => {
    useExpandTreeStore.setState({ expand: { src: true } })
    render(<Tree data={DATA} />)

    await userEvent.click(screen.getByText('App.jsx'))
    expect(useEditorSocketStore.getState().editorSocket.emit)
      .toHaveBeenCalledWith('readFile', { pathToFileOrFolder: '/src/App.jsx' })
  })
})
