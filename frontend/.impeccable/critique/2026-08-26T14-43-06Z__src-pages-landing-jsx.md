---
target: the website (Landing page)
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 2
timestamp: 2026-08-26T14-43-06Z
slug: src-pages-landing-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | `CreatingWorkspace` shows a spinner + one line of copy but no sense of progress/duration for what PRODUCT.md frames as a Docker-backed, possibly multi-second operation. |
| 2 | Match System / Real World | 3/4 | Plain, jargon-free copy — but two differently-labeled buttons ("New project" vs. "Start building →") trigger the identical action, which doesn't match a user's expectation that different labels mean different things. |
| 3 | User Control and Freedom | 2/4 | No cancel/back path once creation starts; the entire idle view (including the header CTA) unmounts, removing even the illusion of an exit if the create call hangs. |
| 4 | Consistency and Standards | 3/4 | Internally consistent with DESIGN.md tokens (accent rationing, hairline cards, chip radius); standard, well-worn CTA pattern. |
| 5 | Error Prevention | 3/4 | Single unmodified action with no user input to get wrong; little to prevent by nature of the page. |
| 6 | Recognition Rather Than Recall | 4/4 | Value prop, CTA, and feature summary are all visible with nothing to remember. |
| 7 | Flexibility and Efficiency | n/a | Single-path Persuade-mode page, one CTA — no power-user accelerators apply here. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Genuinely minimal and on-brand, but the primary CTA's text fails WCAG AA contrast (white on `#3b82f6` measures 3.7:1, needs 4.5:1) — a real, measured defect on the single most important element on the page. |
| 9 | Error Recovery | 2/4 | Error copy is plain-language and correctly placed, but there's no retry affordance — the user must manually re-find and re-click the CTA from scratch. |
| 10 | Help and Documentation | n/a | A self-explanatory, single-action marketing page; no complex task exists here that would need in-context help. |
| **Total** | | **22/32** | **Acceptable** (68.75%, just under the Good threshold) |

## Design Specificity Verdict

**LLM assessment:** This page is honest but generic. The hero copy, the three feature cards, and the "Start building →" CTA describe the *category* (browser-based coding sandbox), not this specific build — the same three cards could sit on a StackBlitz, Replit, or CodeSandbox landing page unchanged. The one genuinely specific element is the `GridBackdrop` graph-paper texture, a real signature tied to the "Graph Paper Studio" north star. Given PRODUCT.md's own framing — a portfolio piece meant to be judged on craft, deliberately leaner than its competitors — the page never actually *shows* that craft: no screenshot, no glimpse of the editor/terminal/preview, nothing that demonstrates rather than states. Verdict: template-competent, not yet author-specific.

**Deterministic scan:** The CLI detector (`detect.mjs`) returned exactly one finding across all Landing-surface files: an "undocumented color `#000`" in `GridBackdrop.jsx`. On inspection this is a false positive — `#000` is used only inside a `radial-gradient` CSS mask (an opacity mechanism, not a rendered color), and DESIGN.md already documents this exact masking behavior in its Grid Backdrop section. No real token drift was found in the landing surface's source.

**Visual overlays:** A live browser overlay pass caught two real issues neither of us would have found from source alone, plus one instrumentation artifact to discard:
- **Real:** the primary CTA's white-on-Drafting-Blue text measures **3.7:1 contrast**, short of the 4.5:1 WCAG AA minimum for that button's `14px` label — confirmed against the actual DESIGN.md-documented `button-primary` token pairing, so this is a real accessibility gap in an intentional color choice, not undocumented drift.
- **Real:** a skipped heading level — the page goes `<h1>Nimbus</h1>` straight to `<h3>` feature-card titles with no `<h2>` in between, confirmed in `FeatureHighlights.jsx`. This breaks the heading outline a screen-reader user relies on to navigate.
- **Discarded as noise:** an overlay hit for a `<span>` reading "Claude is active in this tab" being fully occluded. A source-tree search found no such string anywhere in the Nimbus app — it belongs to the browser extension's own injected status UI, not the page under review, and should not be attributed to Nimbus.

## Overall Impression

The page is calm, restrained, and faithful to its own design system — the accent-rationing and reduced-motion rules from DESIGN.md are honored in the shipped code, not just on paper. But it currently reads as a well-executed *template* for a dev-tool landing page rather than a page built specifically for Nimbus: nothing on it proves the product's craft before the click, two buttons do the same thing for no reason, and the highest-stakes moment on the page — the async "creating your workspace" wait — is the least reassuring part of the experience. The single biggest opportunity is to make the page *show* the product (even one screenshot) rather than only describe it, since PRODUCT.md's own stated audience is people judging craft, not converting on a sales pitch.

## What's Working

1. **Restraint is real, not just claimed.** Drafting Blue appears only on the primary CTA, the header dot, and the spinner arc — nowhere else. The DESIGN.md "One Accent Rule" survived contact with the actual implementation.
2. **`useReducedMotion()` is threaded through every animated component** (`Landing.jsx`, `LandingHero.jsx`, `NimbusButton.jsx`, `CreatingWorkspace.jsx`) with real conditional durations, not a token wrapper — a level of accessibility follow-through most portfolio projects skip.
3. **The `GridBackdrop` radial mask** is an understated, bespoke craft detail — it keeps the ornamental grid from fighting the feature cards' legibility and is the one moment on the page that doesn't feel templated.

## Priority Issues

- **[P0] Primary CTA text fails WCAG AA contrast.** White text on `#3b82f6` (Drafting Blue) measures 3.7:1, below the 4.5:1 minimum for 14px text. This is the single most important interactive element on the page and it fails a hard accessibility floor for low-vision users.
  **Why it matters:** it's not a stylistic nitpick — some real users literally cannot read the one button that matters.
  **Fix:** darken the blue for this specific text pairing, or use a heavier/larger label, or add a subtle text-shadow/outline; verify against 4.5:1 before shipping.
  **Suggested command:** `/impeccable audit`

- **[P0] Duplicate, non-differentiated CTA.** The header's "New project" and the hero's "Start building →" both call the exact same `handleCreateProject` function — same action, two labels, no distinction.
  **Why it matters:** violates users' expectation that different labels mean different things (heuristic #2), and muddies the "one clear action" hierarchy the rest of the page otherwise achieves.
  **Fix:** either demote the header button to a genuinely secondary/future action (e.g., once a projects list exists) or remove it and let the hero CTA stand alone.
  **Suggested command:** `/impeccable shape`

- **[P1] No reassurance or escape during the async creation wait.** `CreatingWorkspace` shows only a spinner and one static line, with no elapsed-time cue, no stage detail, and no way to cancel; the idle view fully unmounts so there's nothing to return to.
  **Why it matters:** PRODUCT.md frames this as a containerized/Docker-backed operation — plausibly several seconds, and capable of failing. This is the highest-stakes moment on the page and it's the least designed.
  **Fix:** add a short secondary line ("usually takes a few seconds") and a way to abort back to idle.
  **Suggested command:** `/impeccable onboard`

- **[P1] Error state has no retry path.** On failure the user sees plain-language error text but must manually re-locate and re-click the original CTA — nothing actionable is attached to the error itself.
  **Why it matters:** the copy says "Try again" but the UI doesn't make that one click away, adding friction at the worst possible moment.
  **Fix:** attach a small inline "Retry" action directly to the error message.
  **Suggested command:** `/impeccable harden`

- **[P2] Skipped heading level (h1 → h3, no h2).** The page jumps from the `<h1>` wordmark straight to `<h3>` feature-card titles.
  **Why it matters:** screen-reader users navigate by heading outline; a skipped level breaks that mental map even though the visual hierarchy looks fine sighted.
  **Fix:** either promote the feature-card titles to `<h2>`, or insert a genuine (even visually subtle) `<h2>` section label above the feature grid.
  **Suggested command:** `/impeccable audit`

## Persona Red Flags

**Jordan (First-Timer):** Doesn't know what "Start building" actually produces — no preview of the IDE, no mention of what template/stack they're getting, nothing until a generic spinner appears. Also can't tell why the header has a second, differently-labeled button that does the same thing as the big blue one, and may hesitate hunting for the difference.

**Riley (Stress Tester):** Nothing guards against a fast double-fire — click "Start building," then immediately click header's "New project" before the transition unmounts it, and `createProjectMutation()` has no explicit re-entrancy guard beyond the view swap's timing. Riley will also try to cancel or hit back during the "Setting up your workspace…" spinner and find no exit at all.

**Sam (Accessibility-Dependent):** Directly implicated by the detector evidence — the primary CTA's 3.7:1 text contrast fails Sam's minimum readability floor, and the skipped `h1→h3` heading level breaks the outline Sam's screen reader relies on to jump between sections.

**Casey (Distracted Mobile User):** The error message (13.5px) sits only 12px below a 14px button with no icon, background chip, or visual separation — on a small, glare-lit screen glanced at quickly, easy to miss entirely.

## Minor Observations

- Large, unstructured empty region below the fold at desktop widths (roughly 40% of a 900px viewport is bare grid backdrop beneath the feature cards) — reads as unfinished rather than deliberate whitespace.
- Nothing on the page shows the actual product (editor/terminal/preview) before commit — for an audience PRODUCT.md describes as recruiters/portfolio evaluators judging craft, this is a missed low-effort way to build confidence (even one static screenshot would help).
- The arrow glyph in "Start building →" is a plain Unicode character with no hover nudge — a cheap, currently-unused opportunity for the "interaction confirms itself" motion DESIGN.md calls for elsewhere.
- Feature card copy is competent but interchangeable ("A real editor" / "Monaco with syntax highlighting…") and never leans on PRODUCT.md's own "leaner than CodeSandbox/Replit" positioning.
- Mobile width (390-414px) could not be live-verified in this session (the browser automation's resize did not actually narrow the viewport in either assessment) — code-level review of the Tailwind `sm:` breakpoints looks reasonable, but this should be confirmed with a real mobile render before considering the page finished.

## Questions to Consider

1. If a recruiter never clicks "Start building," what on this page currently proves craft beyond "it's dark and has a grid"?
2. Why does the header carry a second, fully-redundant CTA — is it meant to imply a future state (a projects dashboard) that doesn't exist yet?
3. Is a bare spinner and one static sentence the right amount of reassurance for an operation PRODUCT.md itself describes as container-backed and non-instant?
