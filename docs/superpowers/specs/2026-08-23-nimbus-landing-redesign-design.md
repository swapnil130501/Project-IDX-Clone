# Nimbus Landing & Design System Redesign

## Context

The app (a CodeSandbox-style cloud IDE clone, currently branded "Project IDX")
has two pages today: `CreateProject` (the landing/entry screen) and
`ProjectPlayground` (the editor shell: `Toolbar`, `FileTabs`, `Tree`,
`EditorComponent`, `BrowserTerminal`, `Browser`). Styling is plain CSS per
component plus a small `src/styles/tokens.css` custom-property sheet. The
current landing page is a generic centered hero with a purple gradient button
and stock copy — it reads as an unfinished tech demo, not a product.

This is a full visual redesign of the app, split into two phases. This spec
covers **Phase 1 only**: the new design system foundation and the landing
page. Phase 2 (re-skinning the editor shell) is scoped at a high level here
and gets its own spec/plan when it starts.

## Goals

- Replace the ad-hoc CSS-custom-property design tokens with Tailwind CSS,
  configured with a custom theme so the project gets a real, consistent
  design system instead of one-off component CSS.
- Rebrand the landing page from "Project IDX" to a new name, **Nimbus**, with
  a "terminal grid" visual direction: near-black background, subtle 1px grid
  lines, single teal-green accent, monospace-forward typography — restrained
  and utilitarian rather than gradient-heavy or glassy.
- Ship a landing page that shows the product (a framed editor-shell mockup)
  rather than only describing it.
- Do not touch `ProjectPlayground` or its child components in this phase —
  they keep their current styling and behavior untouched until Phase 2.

## Non-goals

- Re-skinning the editor, toolbar, file tree, terminal, or browser preview.
  Explicitly deferred to Phase 2.
- Light theme support. Dark-only, matching the rest of the app.
- Any change to `CreateProject`'s behavior (still calls
  `useCreateProject` and navigates to `/project/:id` on success) — this is a
  visual and copy rebuild of the same screen, not a functional change.
- Removing `antd` from `package.json` — it's unused in code already but
  removing the dependency is out of scope for this visual redesign.

## Design system

**Tooling:** Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no
`tailwind.config.js` needed — v4 configures the theme via CSS `@theme` in
`src/index.css`). Add `tailwindcss` and `@tailwindcss/vite` as dev
dependencies, register the plugin in `vite.config.js`, and replace the
`@import './styles/tokens.css';` line in `src/index.css` with
`@import "tailwindcss";` plus an `@theme` block.

**Theme tokens** (defined in the `@theme` block, replacing
`src/styles/tokens.css`):

| Token | Value | Purpose |
|---|---|---|
| `--color-base` | `#0a0a0d` | Page background |
| `--color-surface` | `#111116` | Cards, panels |
| `--color-grid-line` | `#1a1a22` | 1px background grid lines (marketing surfaces only) |
| `--color-border` | `#22222c` | Hairline borders |
| `--color-text` | `#eaeaf0` | Primary text |
| `--color-text-muted` | `#8f8fa3` | Secondary text |
| `--color-accent` | `#3fd6a6` | Single accent — CTAs, focus, active states |
| `--font-mono` | `'Fira Code', ui-monospace, monospace` | Headlines, UI chrome, code |
| `--font-sans` | `system-ui, -apple-system, 'Segoe UI', sans-serif` | Body copy |
| `--radius-default` | `4px` | Sharp corners, not the current 8px pills |

`tokens.css` is deleted; anything still reading its custom properties (only
`index.css` today) is updated to use Tailwind classes or the new `@theme`
variables directly.

**Visual language:** hairline 1px borders instead of soft shadows/glow, sharp
4px corners, one accent color used sparingly (not on every element), grid
background restricted to marketing/landing surfaces so it never leaks into
the editor's visually-quiet requirements in Phase 2.

## Landing page (`CreateProject`)

Rebuilt as a Tailwind-only component (existing `CreateProject.css` deleted).
Structure, top to bottom:

1. **Top nav** — thin bar, `Nimbus` wordmark in monospace on the left, a
   single "Get Started" button on the right (same action as the hero CTA, no
   dead links).
2. **Hero** — grid-line background panel. Headline styled like a terminal
   command (e.g. `> nimbus init`), one-sentence subhead, single primary CTA
   button styled like a shell prompt (e.g. `$ get-started`). Clicking it (nav
   or hero) calls the existing `handleCreateProject` → `useCreateProject`
   flow, unchanged.
3. **Feature grid** — 4 short bordered cards (Instant boot, Live preview,
   Integrated terminal, File tree that just works), monospace
   `[ ]`-bracket-style markers instead of icon-in-a-circle clichés.
4. **Editor preview** — a static framed mockup (built with plain
   div/Tailwind, not a real screenshot) representing the file tree + tabs +
   code + terminal layout, styled like a terminal window, placed after the
   feature grid.
5. **Footer** — one line, no link farm.

No new routes or state; this is a single-file visual rebuild of the existing
`CreateProject.jsx` plus removal of `CreateProject.css` and the unused
`bg-image` background asset reference.

## Phase 2 (future, not built now)

Apply the same Tailwind theme to `ProjectPlayground` and its children
(`Toolbar`, `FileTabs`, `Tree`, `EditorComponent`, `BrowserTerminal`,
`Browser`): flat surfaces (`bg-surface`/a slightly lighter elevated shade, no
grid background), teal-green accent replacing the current blue for active
tabs/selection/focus states. Layout and behavior are unchanged — this is a
re-skin, migrating each component's `.css` file to Tailwind classes one at a
time. Gets its own spec when started.

## Testing

Visual/manual only — start the dev server (`npm run dev`) and check the
landing page renders correctly, the CTA still creates a project and
navigates to `/project/:id`, and no console errors from the Tailwind setup.
No existing automated test suite covers this page.
