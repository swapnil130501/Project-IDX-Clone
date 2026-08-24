# Nimbus Landing + IDE Chrome Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a branded "Nimbus" landing page at `/`, move the existing project-creation form to `/new`, and redesign the file tree and editor tab chrome with Tailwind CSS v4 and `motion` micro-interactions.

**Architecture:** Tailwind v4 is added via `@tailwindcss/vite` with a CSS-first `@theme` block that mirrors the existing `src/styles/tokens.css` palette, so new Tailwind surfaces are visually identical in palette to untouched plain-CSS components. Tailwind's Preflight reset is deliberately NOT imported, so existing components keep their current appearance. Only three surfaces are rebuilt in Tailwind: the new landing page, `Tree`/`TreeStructure`, and the editor chrome (`FileTabs` + the editor pane's borders). Animation uses the `motion` package (`motion/react`), always gated behind `useReducedMotion()`.

**Tech Stack:** React 18.3, Vite 6, react-router-dom 7, Tailwind CSS v4 (`@tailwindcss/vite`), `motion`, Vitest + React Testing Library + jsdom (new dev dependencies), zustand, Monaco, allotment.

**Spec:** This plan is self-contained; the confirmed scope is transcribed into "Confirmed Scope" below. There is no separate spec file. A previous spec (commit `e625a45`) was deliberately deleted by the user and MUST NOT be read or reused.

## Global Constraints

- Product name is exactly **Nimbus**. Do not use "Project IDX" in any new copy.
- Animation library import path is `motion/react` (package `motion`). NEVER install or import `framer-motion`.
- Tailwind v4 only, configured CSS-first via `@theme`. Do NOT create `tailwind.config.js`.
- Tailwind Preflight MUST NOT be imported (see Task 1). Import `tailwindcss/theme.css` and `tailwindcss/utilities.css` only.
- Tailwind classes may only be used in: the new landing page files, `Tree`/`TreeRow`/`TreeStructure`, `FileTabs`/`EditorTab`, and the two specific class blocks in `ProjectPlayground.css`/`ProjectPlayground.jsx` named in Task 7.
- `src/styles/tokens.css` MUST NOT be edited. It stays as-is for out-of-scope components.
- OUT OF SCOPE — do not touch, restyle, or reference: `Toolbar`, `BrowserTerminal`, `Browser`, `ContextMenu` (both files), `CreateInputModal`, `EditorComponent` internals (Monaco options/theme), `antd` removal.
- `CreateProject.jsx` logic and markup MUST NOT change — it is only re-routed.
- Every task ends with a commit. Run `npm run lint` before each commit; it must pass.
- Existing app is JavaScript + JSX (no TypeScript). Keep it that way.

---

## Design Decisions Requiring User Approval

**Approve these before Task 1 begins.**

### Color tokens (Tailwind `@theme`)

Mirrors `tokens.css` exactly for the shared palette, and adds four new tokens the new surfaces need:

| Tailwind token | Hex / value | Source |
|---|---|---|
| `--color-base` | `#181818` | mirrors `--bg-base` |
| `--color-surface` | `#1e1e1e` | mirrors `--bg-surface` |
| `--color-elevated` | `#2a2a2a` | mirrors `--bg-elevated` |
| `--color-line` | `#2a2a2a` | mirrors `--border-subtle` |
| `--color-line-strong` | `#3a3a3d` | NEW — hairline for active/hover chrome |
| `--color-ink` | `#e6e6e6` | mirrors `--text-primary` |
| `--color-ink-dim` | `#9a9a9a` | mirrors `--text-secondary` |
| `--color-ink-faint` | `#7a7a7a` | mirrors `--text-muted` |
| `--color-accent` | `#3b82f6` | mirrors `--accent` |
| `--color-accent-hover` | `#5b9bf5` | mirrors `--accent-hover` |
| `--color-hover` | `rgba(255,255,255,0.045)` | NEW — tree row / tab hover wash |
| `--color-grid` | `rgba(255,255,255,0.035)` | NEW — landing graph-paper line |
| `--color-grid-major` | `rgba(255,255,255,0.06)` | NEW — every 5th grid line |

### Typography

| Token | Value |
|---|---|
| `--font-ui` | `system-ui, -apple-system, 'Segoe UI', sans-serif` (mirrors tokens.css) |
| `--font-mono` | `'Fira Code', ui-monospace, monospace` (mirrors tokens.css) |
| Hero wordmark | 56px / line-height 1.02 / weight 600 / letter-spacing `-0.03em` (mobile: 38px) |
| Hero value prop | 18px / 1.55 / weight 400 / `--color-ink-dim`, max-width 34rem |
| Header logo | 15px / weight 600 / letter-spacing `-0.01em` |
| Feature card title | 15px / weight 550 / `--color-ink` |
| Feature card body | 13.5px / 1.55 / `--color-ink-dim` |
| Tab label | 12.5px mono, tab bar height 32px |
| Tree row | 13px mono, row height 24px, indent 14px per level |

### Radii / other

`--radius-chip: 6px` (buttons, tree rows), `--radius-card: 10px` (feature cards).

### Copy (draft — approve or replace)

- Header logo text: `Nimbus`
- Header CTA: `New project`
- Hero heading: `Nimbus`
- Hero value prop: **"A full development environment in your browser. Open a project, edit, run, and preview — no local setup, no waiting."**
- Hero CTA: `Start building →`
- Feature cards:
  1. **Instant workspaces** — "Spin up a ready-to-run project in seconds. No installs, no config files to babysit."
  2. **A real editor** — "Monaco with syntax highlighting, a live file tree, and a terminal wired to your project."
  3. **Live preview** — "Your app renders beside your code and reloads as you save."

### Routes

| Path | Component | Change |
|---|---|---|
| `/` | `Landing` (new) | NEW |
| `/new` | `CreateProject` (moved, unchanged) | MOVED from `/` |
| `/project/:projectId` | `ProjectPlayground` | unchanged |

---

## File Structure

**Create:**
- `src/styles/theme.css` — Tailwind imports (no preflight) + `@theme` block
- `src/pages/Landing.jsx` — landing composition only
- `src/components/atoms/GridBackdrop/GridBackdrop.jsx` — static graph-paper background layer
- `src/components/atoms/NimbusButton/NimbusButton.jsx` — motion CTA button (primary/ghost)
- `src/components/organisms/Landing/LandingHeader.jsx`
- `src/components/organisms/Landing/LandingHero.jsx`
- `src/components/organisms/Landing/FeatureHighlights.jsx`
- `src/components/molecules/Tree/TreeRow.jsx` — presentational row (file or folder), owns hover/press motion
- `src/components/atoms/EditorTab/EditorTab.jsx` — replaces `EditorButton`
- `src/test/setup.js` — RTL matchers + jsdom shims
- `vitest.config.js`
- Tests: `src/Router.test.jsx`, `src/components/molecules/Tree/Tree.test.jsx`, `src/components/molecules/FileTabs/FileTabs.test.jsx`, `src/pages/Landing.test.jsx`

**Modify:**
- `package.json`, `vite.config.js`, `src/index.css`, `src/Router.jsx`
- `src/components/molecules/Tree/Tree.jsx` (rewrite render, keep handlers/store wiring)
- `src/components/organisms/TreeStructure/TreeStructure.jsx` (wrap in scroll container)
- `src/components/molecules/FileTabs/FileTabs.jsx` (rewrite)
- `src/components/atoms/FileIcon/FileIcon.jsx` (add optional `className`/`compact` prop, backward compatible)
- `src/pages/ProjectPlayground.jsx` (editor pane wrapper classes)
- `src/pages/ProjectPlayground.css` (only `.editor-component` and `.tree-structure` blocks)

**Delete:**
- `src/components/molecules/Tree/Tree.css`
- `src/components/molecules/FileTabs/FileTabs.css`
- `src/components/atoms/EditorButton/EditorButton.jsx` + `EditorButton.css`

---

### Task 1: Tailwind v4 + motion + test harness

**Files:**
- Modify: `package.json`, `vite.config.js`, `src/index.css`
- Create: `src/styles/theme.css`, `vitest.config.js`, `src/test/setup.js`, `src/styles/theme.test.jsx`

**Interfaces:**
- Produces: Tailwind utility classes usable in JSX; theme tokens `bg-base`, `bg-surface`, `bg-elevated`, `border-line`, `border-line-strong`, `text-ink`, `text-ink-dim`, `text-ink-faint`, `bg-accent`, `text-accent`, `bg-hover`, `font-ui`, `font-mono`, `rounded-chip`, `rounded-card`; `npm test` script running Vitest.

- [ ] **Step 1: Install dependencies**

```bash
npm install motion tailwindcss @tailwindcss/vite
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Verify `package.json` lists `motion` and does NOT list `framer-motion`.

- [ ] **Step 2: Add the `test` script to `package.json`**

In the `"scripts"` block add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
})
```

- [ ] **Step 4: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom/vitest'

// jsdom lacks matchMedia; motion's useReducedMotion needs it.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
```

- [ ] **Step 5: Write the failing theme test**

Create `src/styles/theme.test.jsx`:

```jsx
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
```

- [ ] **Step 6: Run it and confirm it fails**

Run: `npm test -- src/styles/theme.test.jsx`
Expected: FAIL — `ENOENT: no such file or directory ... src/styles/theme.css`

- [ ] **Step 7: Create `src/styles/theme.css`**

```css
/* Tailwind v4, CSS-first. Preflight is deliberately NOT imported:
   out-of-scope components rely on browser default element styling plus
   their own plain CSS, and Preflight would silently restyle them. */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

@theme {
  --color-base: #181818;
  --color-surface: #1e1e1e;
  --color-elevated: #2a2a2a;
  --color-line: #2a2a2a;
  --color-line-strong: #3a3a3d;

  --color-ink: #e6e6e6;
  --color-ink-dim: #9a9a9a;
  --color-ink-faint: #7a7a7a;

  --color-accent: #3b82f6;
  --color-accent-hover: #5b9bf5;

  --color-hover: rgba(255, 255, 255, 0.045);
  --color-grid: rgba(255, 255, 255, 0.035);
  --color-grid-major: rgba(255, 255, 255, 0.06);

  --font-ui: system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "Fira Code", ui-monospace, monospace;

  --radius-chip: 6px;
  --radius-card: 10px;
}
```

- [ ] **Step 8: Wire Tailwind into Vite**

Replace `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 9: Import the theme from `index.css`**

Edit `src/index.css` so the first two lines are (leave the rest of the file untouched):

```css
@import './styles/tokens.css';
@import './styles/theme.css';
```

- [ ] **Step 10: Run the test and the build**

Run: `npm test -- src/styles/theme.test.jsx`
Expected: PASS

Run: `npm run build`
Expected: exit 0.

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 11: Manual visual regression check**

Run `npm run dev`, open `/project/<any-id>` (or `/` for the old form). Confirm the Toolbar, terminal, and preview panes look EXACTLY as before — this proves Preflight is not leaking. If anything shifted, Preflight got imported; fix Step 7.

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json vite.config.js vitest.config.js src/test/setup.js src/styles/theme.css src/styles/theme.test.jsx src/index.css
git commit -m "chore: add tailwind v4, motion, and vitest harness"
```

---

### Task 2: Move CreateProject to `/new` and stub the `/` landing route

**Files:**
- Modify: `src/Router.jsx`
- Create: `src/pages/Landing.jsx`, `src/Router.test.jsx`

**Interfaces:**
- Consumes: nothing from Task 1 beyond the working test harness.
- Produces: `export default function Landing()` at `src/pages/Landing.jsx`; route `/new` renders `CreateProject`; route `/` renders `Landing`.

- [ ] **Step 1: Write the failing routing test**

Create `src/Router.test.jsx`:

```jsx
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

  it('renders the create-project form at /new', () => {
    renderAt('/new')
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/Router.test.jsx`
Expected: FAIL — `Failed to resolve import "./pages/Landing"`.

- [ ] **Step 3: Create the minimal `src/pages/Landing.jsx`**

```jsx
function Landing() {
    return (
        <main>
            <h1>Nimbus</h1>
        </main>
    );
}

export default Landing;
```

- [ ] **Step 4: Update `src/Router.jsx`**

```jsx
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateProject from "./pages/CreateProject";
import ProjectPlayground from "./pages/ProjectPlayground";

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/new" element={<CreateProject />} />
            <Route path="/project/:projectId" element={<ProjectPlayground />} />
        </Routes>
    );
}
```

- [ ] **Step 5: Run the test**

Run: `npm test -- src/Router.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Manual check**

`npm run dev` → `/` shows the bare "Nimbus" heading, `/new` shows the unchanged old form, and clicking "Get Started →" still navigates to `/project/:id`.

- [ ] **Step 7: Commit**

```bash
git add src/Router.jsx src/pages/Landing.jsx src/Router.test.jsx
git commit -m "feat: move create-project form to /new and stub Nimbus landing at /"
```

---

### Task 3: `NimbusButton` and `GridBackdrop` atoms

**Files:**
- Create: `src/components/atoms/NimbusButton/NimbusButton.jsx`, `src/components/atoms/GridBackdrop/GridBackdrop.jsx`, `src/components/atoms/NimbusButton/NimbusButton.test.jsx`

**Interfaces:**
- Produces:
  - `NimbusButton({ children, onClick, variant = 'primary', className = '' })` — `variant` is `'primary' | 'ghost'`. Renders a `<button type="button">`.
  - `GridBackdrop({ className = '' })` — renders an `aria-hidden` absolutely-positioned div; the parent must be `relative`.

- [ ] **Step 1: Write the failing test**

Create `src/components/atoms/NimbusButton/NimbusButton.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/components/atoms/NimbusButton`
Expected: FAIL — cannot resolve `./NimbusButton`.

- [ ] **Step 3: Implement `NimbusButton.jsx`**

```jsx
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';

const VARIANTS = {
    primary:
        'bg-accent text-white border border-transparent hover:bg-accent-hover',
    ghost:
        'bg-transparent text-ink-dim border border-line hover:text-ink hover:border-line-strong',
};

function NimbusButton({ children, onClick, variant = 'primary', className = '' }) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97, y: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={`font-ui text-[14px] font-medium leading-none rounded-chip px-4 py-2.5 cursor-pointer outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base ${VARIANTS[variant]} ${className}`}
        >
            {children}
        </motion.button>
    );
}

NimbusButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'ghost']),
    className: PropTypes.string,
};

export default NimbusButton;
```

- [ ] **Step 4: Implement `GridBackdrop.jsx`**

Static (non-animated) graph paper: a fine 28px grid plus a stronger 140px grid, faded out toward the bottom with a mask.

```jsx
import PropTypes from 'prop-types';

function GridBackdrop({ className = '' }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${className}`}
            style={{
                backgroundImage: [
                    'linear-gradient(to right, var(--color-grid) 1px, transparent 1px)',
                    'linear-gradient(to bottom, var(--color-grid) 1px, transparent 1px)',
                    'linear-gradient(to right, var(--color-grid-major) 1px, transparent 1px)',
                    'linear-gradient(to bottom, var(--color-grid-major) 1px, transparent 1px)',
                ].join(','),
                backgroundSize: '28px 28px, 28px 28px, 140px 140px, 140px 140px',
                maskImage:
                    'radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 100%)',
                WebkitMaskImage:
                    'radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 100%)',
            }}
        />
    );
}

GridBackdrop.propTypes = { className: PropTypes.string };

export default GridBackdrop;
```

- [ ] **Step 5: Run the test**

Run: `npm test -- src/components/atoms/NimbusButton`
Expected: PASS (2 tests).

- [ ] **Step 6: Lint and commit**

```bash
npm run lint
git add src/components/atoms/NimbusButton src/components/atoms/GridBackdrop
git commit -m "feat: add NimbusButton and GridBackdrop atoms"
```

---

### Task 4: Landing page — header, hero, feature highlights

**Files:**
- Create: `src/components/organisms/Landing/LandingHeader.jsx`, `src/components/organisms/Landing/LandingHero.jsx`, `src/components/organisms/Landing/FeatureHighlights.jsx`, `src/pages/Landing.test.jsx`
- Modify: `src/pages/Landing.jsx`

**Interfaces:**
- Consumes: `NimbusButton` and `GridBackdrop` from Task 3 (exact props as defined there).
- Produces: `Landing` page composing `LandingHeader`, `LandingHero`, `FeatureHighlights`. Both CTAs navigate to `/new` via `useNavigate()`.

- [ ] **Step 1: Write the failing test**

Create `src/pages/Landing.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/pages/Landing.test.jsx`
Expected: FAIL — no value-prop text, 0 level-3 headings.

- [ ] **Step 3: Implement `LandingHeader.jsx`**

```jsx
import PropTypes from 'prop-types';
import NimbusButton from '../../atoms/NimbusButton/NimbusButton';

function LandingHeader({ onCta }) {
    return (
        <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
            <div className="flex items-center gap-2.5">
                <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-accent"
                />
                <span className="font-ui text-[15px] font-semibold tracking-[-0.01em] text-ink">
                    Nimbus
                </span>
            </div>
            <NimbusButton variant="ghost" onClick={onCta}>
                New project
            </NimbusButton>
        </header>
    );
}

LandingHeader.propTypes = { onCta: PropTypes.func.isRequired };

export default LandingHeader;
```

- [ ] **Step 4: Implement `LandingHero.jsx`**

```jsx
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';
import NimbusButton from '../../atoms/NimbusButton/NimbusButton';

function LandingHero({ onCta }) {
    const reduceMotion = useReducedMotion();

    const container = {
        hidden: {},
        show: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 },
        },
    };
    const item = {
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 flex flex-col items-start px-6 pt-24 pb-28 sm:px-10 sm:pt-32 sm:pb-36 max-w-3xl"
        >
            <motion.h1
                variants={item}
                className="font-ui text-[38px] sm:text-[56px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink"
            >
                Nimbus
            </motion.h1>

            <motion.p
                variants={item}
                className="mt-5 max-w-[34rem] font-ui text-[18px] leading-[1.55] text-ink-dim"
            >
                A full development environment in your browser. Open a project, edit,
                run, and preview — no local setup, no waiting.
            </motion.p>

            <motion.div variants={item} className="mt-9">
                <NimbusButton onClick={onCta}>Start building →</NimbusButton>
            </motion.div>
        </motion.section>
    );
}

LandingHero.propTypes = { onCta: PropTypes.func.isRequired };

export default LandingHero;
```

- [ ] **Step 5: Implement `FeatureHighlights.jsx`**

```jsx
const FEATURES = [
    {
        title: 'Instant workspaces',
        body: 'Spin up a ready-to-run project in seconds. No installs, no config files to babysit.',
    },
    {
        title: 'A real editor',
        body: 'Monaco with syntax highlighting, a live file tree, and a terminal wired to your project.',
    },
    {
        title: 'Live preview',
        body: 'Your app renders beside your code and reloads as you save.',
    },
];

function FeatureHighlights() {
    return (
        <section className="relative z-10 px-6 pb-24 sm:px-10">
            <div className="grid gap-4 sm:grid-cols-3 max-w-5xl">
                {FEATURES.map((feature) => (
                    <div
                        key={feature.title}
                        className="rounded-card border border-line bg-surface/70 p-5 transition-colors duration-200 hover:border-line-strong"
                    >
                        <h3 className="font-ui text-[15px] font-semibold text-ink">
                            {feature.title}
                        </h3>
                        <p className="mt-2 font-ui text-[13.5px] leading-[1.55] text-ink-dim">
                            {feature.body}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeatureHighlights;
```

- [ ] **Step 6: Rewrite `src/pages/Landing.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import GridBackdrop from '../components/atoms/GridBackdrop/GridBackdrop';
import LandingHeader from '../components/organisms/Landing/LandingHeader';
import LandingHero from '../components/organisms/Landing/LandingHero';
import FeatureHighlights from '../components/organisms/Landing/FeatureHighlights';

function Landing() {
    const navigate = useNavigate();

    function goToNewProject() {
        navigate('/new');
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-base text-ink">
            <GridBackdrop />
            <LandingHeader onCta={goToNewProject} />
            <LandingHero onCta={goToNewProject} />
            <FeatureHighlights />
        </main>
    );
}

export default Landing;
```

- [ ] **Step 7: Run the tests**

Run: `npm test -- src/pages/Landing.test.jsx src/Router.test.jsx`
Expected: PASS (6 tests).

- [ ] **Step 8: Manual visual check**

`npm run dev` → `/`. Confirm: dark `#181818` background, visible-but-subtle grid fading toward the bottom, hero fades up on load, both CTAs go to `/new`, feature row sits below the fold at 1280×800, layout does not break at 375px width.

- [ ] **Step 9: Lint and commit**

```bash
npm run lint
git add src/pages/Landing.jsx src/pages/Landing.test.jsx src/components/organisms/Landing
git commit -m "feat: build Nimbus landing page with grid backdrop and hero"
```

---

### Task 5: Tree redesign with expand/collapse and hover micro-interactions

**Files:**
- Create: `src/components/molecules/Tree/TreeRow.jsx`, `src/components/molecules/Tree/Tree.test.jsx`
- Modify: `src/components/molecules/Tree/Tree.jsx`, `src/components/atoms/FileIcon/FileIcon.jsx`
- Delete: `src/components/molecules/Tree/Tree.css`

**Interfaces:**
- Consumes: nothing from Tasks 2-4.
- Produces:
  - `TreeRow({ depth, isFolder, isExpanded, name, extension, onClick, onContextMenu })` — renders a full-width row; folders get a rotating chevron, files get a `FileIcon`.
  - `FileIcon({ extension, compact = false })` — `compact` drops the hardcoded `marginLeft: '10px'` / `marginRight: '5px'`. Default `false` keeps today's exact behavior so `CreateFileFolderModal` is unaffected.

- [ ] **Step 1: Write the failing test**

Create `src/components/molecules/Tree/Tree.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/components/molecules/Tree`
Expected: FAIL — with the current implementation `index.js` is absent before expand (that assertion passes) but the second test fails because clicking `App.jsx` text hits a `<span>` whose handler is on the parent; more importantly the run must be red before you refactor. If both happen to pass, still proceed — they become the regression net for the rewrite.

- [ ] **Step 3: Make `FileIcon` size-configurable (backward compatible)**

Replace `src/components/atoms/FileIcon/FileIcon.jsx` with:

```jsx
import { FaCss3, FaHtml5, FaJs, FaFileAlt } from "react-icons/fa";
import { GrReactjs } from "react-icons/gr";

export const FileIcon = ({ extension, compact = false }) => {
    const iconStyle = {
        height: compact ? "14px" : "16px",
        width: compact ? "14px" : "16px",
        marginRight: compact ? "0" : "5px",
        marginLeft: compact ? "0" : "10px",
        display: "flex",
        alignItems: "center",
    };

    const IconMapper = {
        js: <FaJs color="#f1fa8c" style={iconStyle} />,
        jsx: <GrReactjs color="#61dbfa" style={iconStyle} />,
        css: <FaCss3 color="#8be9fd" style={iconStyle} />,
        html: <FaHtml5 color="#ff5555" style={iconStyle} />,
    };

    return (
        <span style={{ display: "flex", alignItems: "center" }}>
            {IconMapper[extension] || (
                <FaFileAlt color="#6272a4" style={iconStyle} />
            )}
        </span>
    );
};
```

- [ ] **Step 4: Create `TreeRow.jsx`**

```jsx
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';
import { IoIosArrowForward } from 'react-icons/io';
import { FileIcon } from '../../atoms/FileIcon/FileIcon';

const ROW =
    'group flex w-full items-center gap-1.5 h-6 rounded-chip pr-2 cursor-pointer select-none text-left font-mono text-[13px] leading-none outline-none focus-visible:ring-1 focus-visible:ring-accent';

function TreeRow({
    depth,
    isFolder,
    isExpanded,
    name,
    extension,
    onClick,
    onContextMenu,
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onClick}
            onContextMenu={onContextMenu}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.045)' }}
            whileTap={reduceMotion ? undefined : { scale: 0.995 }}
            transition={{ duration: 0.12 }}
            style={{
                paddingLeft: `${6 + depth * 14}px`,
                backgroundColor: 'rgba(255,255,255,0)',
                border: 'none',
            }}
            className={`${ROW} ${
                isFolder && isExpanded ? 'text-ink' : 'text-ink-dim'
            } hover:text-ink`}
        >
            {isFolder ? (
                <motion.span
                    aria-hidden="true"
                    className="flex h-3.5 w-3.5 items-center justify-center text-ink-faint group-hover:text-ink-dim"
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    initial={false}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 500, damping: 34 }
                    }
                >
                    <IoIosArrowForward size={13} />
                </motion.span>
            ) : (
                <span className="flex h-3.5 w-3.5 items-center justify-center">
                    <FileIcon extension={extension} compact />
                </span>
            )}
            <span className="truncate">{name}</span>
        </motion.button>
    );
}

TreeRow.propTypes = {
    depth: PropTypes.number.isRequired,
    isFolder: PropTypes.bool.isRequired,
    isExpanded: PropTypes.bool,
    name: PropTypes.string.isRequired,
    extension: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onContextMenu: PropTypes.func.isRequired,
};

export default TreeRow;
```

- [ ] **Step 5: Rewrite `Tree.jsx`**

All store wiring and handler bodies are preserved verbatim from the current file; only the render output and the new `depth` prop change.

```jsx
import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { CreateFileModal } from "../CreateInputModal/CreateFileFolderModal";
import { useCreateFileStore } from "../../../store/createFileFolderStore";
import { useExpandTreeStore } from "../../../store/expandTreeStore";
import TreeRow from "./TreeRow";

function Tree({ data, depth = 0 }) {
    const { editorSocket } = useEditorSocketStore();
    const {
        setIsOpen: setFileContextMenuIsOpen,
        setX: setFileContextMenuX,
        setY: setFileContextMenuY,
        setFile,
    } = useFileContextMenuStore();
    const {
        setX: setFolderContextMenuX,
        setY: setFolderContextMenuY,
        setIsOpen: setFolderContextMenuIsOpen,
        setFolder,
    } = useFolderContextMenuStore();
    const { isModalOpen, folderPath, isFolderCreation } = useCreateFileStore();
    const { expand, toggleExpand } = useExpandTreeStore();
    const reduceMotion = useReducedMotion();

    if (!data) {
        return null;
    }

    const isFolder = Boolean(data.children);
    const isExpanded = Boolean(expand[data.name]);

    function computeExtension(node) {
        const names = node.name.split(".");
        return names.length > 1 ? names[names.length - 1] : null;
    }

    function handleClick() {
        if (isFolder) {
            toggleExpand(data.name);
            return;
        }
        editorSocket.emit("readFile", { pathToFileOrFolder: data.path });
    }

    function handleContextMenu(e) {
        e.preventDefault();
        if (isFolder) {
            setFolder(data.path);
            setFolderContextMenuX(e.clientX);
            setFolderContextMenuY(e.clientY);
            setFolderContextMenuIsOpen(true);
            return;
        }
        setFile(data.path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    return (
        <div className="w-full">
            <TreeRow
                depth={depth}
                isFolder={isFolder}
                isExpanded={isExpanded}
                name={data.name}
                extension={isFolder ? undefined : computeExtension(data)}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            />

            {isFolder && isModalOpen && folderPath === data.path && (
                <div style={{ paddingLeft: `${6 + (depth + 1) * 14}px` }}>
                    <CreateFileModal isFolderCreation={isFolderCreation} />
                </div>
            )}

            <AnimatePresence initial={false}>
                {isFolder && isExpanded && data.children?.length > 0 && (
                    <motion.div
                        key="children"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{
                            duration: reduceMotion ? 0 : 0.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                    >
                        {data.children.map((child) => (
                            <Tree data={child} depth={depth + 1} key={child.name} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

Tree.propTypes = {
    data: PropTypes.object,
    depth: PropTypes.number,
};

export default Tree;
```

Note the behavior change this locks in: folder rows now toggle on click via the row itself (previously the whole folder label was a button; same UX, one code path). File rows keep emitting `readFile`.

- [ ] **Step 6: Delete the old stylesheet**

```bash
git rm src/components/molecules/Tree/Tree.css
```

- [ ] **Step 7: Run the tests**

Run: `npm test -- src/components/molecules/Tree`
Expected: PASS (2 tests).

- [ ] **Step 8: Manual check**

`npm run dev` → open a project. Confirm: folders expand/collapse with a smooth height animation, chevron rotates 90°, row hover shows a subtle wash, right-click still opens the correct context menu for files and folders, and the create-file/folder modal still appears under the right folder.

- [ ] **Step 9: Lint and commit**

```bash
npm run lint
git add -A src/components/molecules/Tree src/components/atoms/FileIcon
git commit -m "feat: redesign file tree with tailwind and motion micro-interactions"
```

---

### Task 6: Editor tab bar redesign with open/close and active-indicator animations

**Files:**
- Create: `src/components/atoms/EditorTab/EditorTab.jsx`, `src/components/molecules/FileTabs/FileTabs.test.jsx`
- Modify: `src/components/molecules/FileTabs/FileTabs.jsx`
- Delete: `src/components/atoms/EditorButton/EditorButton.jsx`, `src/components/atoms/EditorButton/EditorButton.css`, `src/components/molecules/FileTabs/FileTabs.css`

**Interfaces:**
- Consumes: `useActiveFileTabStore` (`openTabs`, `activeFileTab`, `activateTab`, `closeTab`) — unchanged.
- Produces: `EditorTab({ label, isActive, onClick, onClose })`. The active-tab indicator uses `layoutId="active-tab-indicator"`.

- [ ] **Step 1: Write the failing test**

Create `src/components/molecules/FileTabs/FileTabs.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/components/molecules/FileTabs`
Expected: FAIL — no accessible "Close b.js" button exists (today's close control is a bare `<span>` with `×`).

- [ ] **Step 3: Create `EditorTab.jsx`**

Cursor-inspired minimal chrome: 32px tall, hairline right divider, no top border block, an accent underline that slides between tabs via shared `layoutId`.

```jsx
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';

function EditorTab({ label, isActive, onClick, onClose }) {
    const reduceMotion = useReducedMotion();

    function handleClose(e) {
        e.stopPropagation();
        onClose();
    }

    return (
        <motion.div
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0"
        >
            <div
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick();
                    }
                }}
                className={`group flex h-8 cursor-pointer select-none items-center gap-2 border-r border-line pl-3 pr-2 font-mono text-[12.5px] leading-none transition-colors duration-150 ${
                    isActive
                        ? 'bg-surface text-ink'
                        : 'bg-base text-ink-faint hover:bg-hover hover:text-ink-dim'
                }`}
            >
                <span className="truncate max-w-[14rem]">{label}</span>

                <button
                    type="button"
                    aria-label={`Close ${label}`}
                    onClick={handleClose}
                    className="flex h-4 w-4 items-center justify-center rounded-chip border-none bg-transparent text-[13px] leading-none text-ink-faint opacity-0 transition-opacity duration-150 hover:bg-elevated hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 aria-[current]:opacity-100"
                    style={isActive ? { opacity: 1 } : undefined}
                >
                    ×
                </button>
            </div>

            {isActive && (
                <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 480, damping: 38 }
                    }
                />
            )}
        </motion.div>
    );
}

EditorTab.propTypes = {
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditorTab;
```

- [ ] **Step 4: Rewrite `FileTabs.jsx`**

```jsx
import { AnimatePresence } from 'motion/react';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import EditorTab from '../../atoms/EditorTab/EditorTab';

function FileTabs() {
    const { openTabs, activeFileTab, activateTab, closeTab } = useActiveFileTabStore();

    if (openTabs.length === 0) {
        return null;
    }

    return (
        <div className="flex shrink-0 overflow-x-auto border-b border-line bg-base">
            <AnimatePresence initial={false} mode="popLayout">
                {openTabs.map((tab) => (
                    <EditorTab
                        key={tab.path}
                        label={tab.name}
                        isActive={activeFileTab?.path === tab.path}
                        onClick={() => activateTab(tab.path)}
                        onClose={() => closeTab(tab.path)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export default FileTabs;
```

- [ ] **Step 5: Delete the replaced files**

```bash
git rm src/components/atoms/EditorButton/EditorButton.jsx src/components/atoms/EditorButton/EditorButton.css src/components/molecules/FileTabs/FileTabs.css
```

- [ ] **Step 6: Verify no dangling imports**

Run: `npx eslint src --no-warn-ignored` and grep:

```bash
git grep -n "EditorButton" -- src || echo "no references — good"
```

Expected: `no references — good`.

- [ ] **Step 7: Run the tests**

Run: `npm test -- src/components/molecules/FileTabs`
Expected: PASS (3 tests).

- [ ] **Step 8: Manual check**

`npm run dev` → open a project, open 3+ files from the tree. Confirm: tabs slide in when opened and animate out when closed, the accent underline slides from the old tab to the new one on switch, close `×` appears on hover (always visible on the active tab), and the tab bar scrolls horizontally past ~8 tabs.

- [ ] **Step 9: Lint and commit**

```bash
npm run lint
git add -A src/components/atoms/EditorTab src/components/atoms/EditorButton src/components/molecules/FileTabs
git commit -m "feat: rebuild editor tab bar with minimal chrome and motion transitions"
```

---

### Task 7: Editor pane and sidebar chrome refinement

**Files:**
- Modify: `src/pages/ProjectPlayground.jsx` (editor + tree wrapper divs), `src/pages/ProjectPlayground.css` (only the `.editor-component` and `.tree-structure` blocks)

**Interfaces:**
- Consumes: Tailwind theme tokens from Task 1.
- Produces: no new exports; visual-only change.

- [ ] **Step 1: Replace the two class blocks in `ProjectPlayground.css`**

Delete the entire `.tree-structure { ... }` and `.editor-component { ... }` blocks. Leave `.project-playground`, `.playground-body`, `.browser-terminal`, `.browser-container`, and all scrollbar rules EXACTLY as they are — those belong to out-of-scope components.

- [ ] **Step 2: Update the two wrapper divs in `ProjectPlayground.jsx`**

Replace `<div className="tree-structure">` with:

```jsx
<div className="h-full overflow-y-auto border-r border-line bg-base px-1.5 py-2 text-ink">
```

Replace `<div className="editor-component">` with:

```jsx
<div className="relative flex h-full flex-col overflow-hidden border-l border-line bg-surface">
```

Change nothing else in the file.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 4: Manual check**

`npm run dev` → open a project. Confirm: the tree sidebar has a hairline right border and correct padding, the editor pane keeps a hairline left border, the Monaco surface still fills the pane with no scroll or layout break, the terminal and preview panes are visually unchanged from before this whole plan, and the allotment drag handles still resize all three panes.

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/pages/ProjectPlayground.jsx src/pages/ProjectPlayground.css
git commit -m "style: refine editor pane and tree sidebar chrome"
```

---

### Task 8: Full verification pass

**Files:** none modified (verification only; fix-forward commits allowed if defects are found).

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: all suites PASS, 0 failures.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: exit 0, no Tailwind or unresolved-import warnings.

- [ ] **Step 4: Out-of-scope regression sweep**

Run `npm run preview`, then confirm nothing changed visually for: `Toolbar`, `BrowserTerminal`, `Browser` preview pane, `FileContextMenu`, `FolderContextMenu`, `CreateFileFolderModal`, and the `/new` page. Compare against `git stash`-free screenshots taken at `main` if uncertain. Any difference means Preflight leaked or a shared file was over-edited — fix before proceeding.

- [ ] **Step 5: Reduced-motion check**

In Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", reload `/` and a project. Confirm: hero appears immediately without a fade-up, tree expand/collapse is instant, tab indicator jumps rather than slides, no animation runs.

- [ ] **Step 6: End-to-end happy path**

`/` → click "Start building →" → `/new` → click "Get Started →" → lands on `/project/:id` → tree loads and expands → open two files → switch tabs → close one → terminal and preview still work.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "fix: address verification findings from nimbus redesign"
```

---

## Known Pre-Existing Issues (NOT in scope — do not fix)

- `src/pages/CreateProject.jsx` references `src="src/assets/bg-image.png"`, a dev-only path that breaks in a production build. It is out of scope; report it to the user rather than fixing it here.
- `antd` and `@ant-design/icons` remain installed but unused. Leave them.

## Self-Review Notes

- Spec coverage: landing (Tasks 3, 4), route move (Task 2), tree redesign + animation (Task 5), editor chrome + animation (Tasks 6, 7), button micro-interactions (Tasks 3, 5, 6), Tailwind + motion deps (Task 1), theme mirroring tokens.css (Task 1 `@theme`).
- Naming consistency verified: `NimbusButton({ children, onClick, variant, className })`, `GridBackdrop({ className })`, `TreeRow({ depth, isFolder, isExpanded, name, extension, onClick, onContextMenu })`, `EditorTab({ label, isActive, onClick, onClose })`, `FileIcon({ extension, compact })`, `Tree({ data, depth })` are used identically wherever referenced.
