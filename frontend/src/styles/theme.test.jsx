import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const theme = readFileSync(resolve('src/styles/theme.css'), 'utf8')

describe('theme.css', () => {
  it('imports tailwind utilities and theme but not preflight', () => {
    expect(theme).toContain('tailwindcss/theme.css')
    expect(theme).toContain('tailwindcss/utilities.css')
    expect(theme).not.toContain('preflight')
    expect(theme).not.toContain('@import "tailwindcss"')
  })

  it('mirrors the tokens.css dark palette', () => {
    expect(theme).toContain('--color-base: #181818')
    expect(theme).toContain('--color-surface: #1e1e1e')
    expect(theme).toContain('--color-ink: #e6e6e6')
    expect(theme).toContain('--color-accent: #3b82f6')
  })
})
