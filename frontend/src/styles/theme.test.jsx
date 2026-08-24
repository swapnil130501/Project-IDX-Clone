import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const theme = readFileSync(resolve('src/styles/theme.css'), 'utf8')
const tokens = readFileSync(resolve('src/styles/tokens.css'), 'utf8')

// Extracts the value of `--name: value;` from a CSS text block, normalizing
// quote style (theme.css uses double quotes, tokens.css uses single quotes)
// so the comparison is on the actual font stack, not incidental syntax.
function extractVar(css, name) {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
  return match ? match[1].trim().replace(/'/g, '"') : null
}

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

  // theme.css's @theme block emits --font-mono/--font-ui into :root, and
  // since theme.css is imported after tokens.css in index.css, it silently
  // wins for every component in the app (including out-of-scope ones that
  // consume var(--font-ui)/var(--font-mono) via plain CSS). tokens.css is
  // supposed to remain the source of truth for those components, with
  // theme.css only mirroring it. This test locks that mirror in place so
  // any drift between the two files' font tokens fails loudly.
  it('mirrors the tokens.css font tokens exactly', () => {
    const themeFontMono = extractVar(theme, 'font-mono')
    const themeFontUi = extractVar(theme, 'font-ui')
    const tokensFontMono = extractVar(tokens, 'font-mono')
    const tokensFontUi = extractVar(tokens, 'font-ui')

    expect(themeFontMono).not.toBeNull()
    expect(themeFontUi).not.toBeNull()
    expect(tokensFontMono).not.toBeNull()
    expect(tokensFontUi).not.toBeNull()

    expect(themeFontMono).toBe(tokensFontMono)
    expect(themeFontUi).toBe(tokensFontUi)
  })
})
