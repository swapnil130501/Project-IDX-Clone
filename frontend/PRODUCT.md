# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience is the builder themself and people evaluating their work (recruiters, GitHub/portfolio visitors), not a broad external user base yet. The product is designed and built as a personal/portfolio project: a from-scratch clone of a browser-based coding sandbox (in the vein of Project IDX, CodeSandbox, Replit). Secondary, aspirational audience if it grows past portfolio stage: developers who want to spin up a disposable, zero-install coding environment quickly.

## Product Purpose

Nimbus is a full development environment that runs in the browser: a file tree, a Monaco-based code editor, an integrated terminal (xterm.js over Socket.IO to a Dockerized backend), and a live preview pane, all in one page. Success today means the sandbox works end-to-end (create a project, edit files, run a terminal, see a live preview) and demonstrates strong product and visual craft as a portfolio piece.

## Positioning

Deliberately leaner and simpler than large hosted competitors (CodeSandbox, Replit, Project IDX): fewer features, less bloat, and a faster path from landing on the page to a working sandbox. It does not claim collaboration, multi-user, or enterprise features — those are explicitly future/V2 ideas, not current positioning.

## Operating Context

- Runs as a Vite + React SPA (`frontend/`) talking to a Node.js/Express backend (`backend/`) over REST (axios) and Socket.IO (editor file events, terminal I/O).
- Backend/project execution is containerized via Docker (docker-compose).
- Three-pane IDE layout (tree / editor / terminal+preview) built with the Allotment resizable-panel library.
- Routes: `/` marketing landing page, `/new` project-creation form, `/project/:projectId` the IDE workspace.

## Capabilities and Constraints

- Stack: React 18, Vite 6, react-router-dom 7, Zustand for state, TanStack Query + axios for data fetching, Monaco editor, xterm.js, Socket.IO client, Tailwind CSS v4 (CSS-first `@theme`, Preflight intentionally not imported so legacy plain-CSS components are unaffected), `motion` for animation (never `framer-motion`), Vitest + React Testing Library for tests. JavaScript/JSX only, no TypeScript.
- Product name is exactly **Nimbus** in all user-facing and new copy; legacy internal/repo naming ("Project IDX Clone") is not used in the product itself.
- `antd` and `@ant-design/icons` are installed but unused/legacy — not part of the current design system.
- Known pre-existing issue (not yet fixed): `CreateProject.jsx` references a dev-only asset path (`src/assets/bg-image.png`) that breaks in production builds.
- No formal accessibility standard is established yet; treat as undecided rather than absent-by-design.

## Brand Commitments

- Name: **Nimbus**.
- Established visual direction (from the 2026-08-24 Nimbus landing/IDE-chrome redesign): dark IDE theme, near-black base (`#181818`)/surface (`#1e1e1e`)/elevated (`#2a2a2a`) tones, a blue accent (`#3b82f6`), monospace UI type for tree/tabs and a system-ui sans for prose, subtle graph-paper grid backdrop on the landing hero, restrained motion (spring-based hover/press, gated behind `useReducedMotion`).
- Voice: minimal, direct product copy (e.g. "A full development environment in your browser. Open a project, edit, run, and preview — no local setup, no waiting.").

## Evidence on Hand

- `docs/superpowers/plans/2026-08-24-nimbus-landing-and-ide-chrome-redesign.md` — an implemented plan documenting the Nimbus rebrand, landing page, and IDE chrome redesign; treat its recorded tokens/typography/copy as current incumbent visual truth unless superseded.
- No customer testimonials, case studies, usage data, or press exist; do not fabricate any.

## Product Principles

1. Zero-friction entry: opening a working sandbox should require no local installs or configuration.
2. Lean over feature-complete: prefer a smaller, well-crafted feature set to matching every capability of larger hosted competitors.
3. Visual and interaction craft matters as much as function, since the project's current purpose is to demonstrate portfolio-quality work.
4. Preserve the existing dark IDE visual language and Nimbus naming/voice already established in the codebase rather than reinventing it per feature.

## Accessibility & Inclusion

Not yet established as a product requirement. No specific standard or user need has been confirmed; do not assume WCAG conformance or invent accessibility claims until this is revisited.
