---
name: Nimbus
description: A full development environment in your browser — editor, terminal, and live preview in one dark, precise workspace.
colors:
  base: "#181818"
  surface: "#1e1e1e"
  elevated: "#2a2a2a"
  line: "#2a2a2a"
  line-strong: "#3a3a3d"
  ink: "#e6e6e6"
  ink-dim: "#9a9a9a"
  ink-faint: "#7a7a7a"
  drafting-blue: "#3b82f6"
  drafting-blue-hover: "#5b9bf5"
  success: "#3fb950"
  danger: "#f85149"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.55
  label-mono:
    fontFamily: "'Fira Code', ui-monospace, monospace"
    fontSize: "12.5px"
    lineHeight: 1
  tree-row-mono:
    fontFamily: "'Fira Code', ui-monospace, monospace"
    fontSize: "13px"
    lineHeight: 1
rounded:
  chip: "6px"
  card: "10px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
components:
  button-primary:
    backgroundColor: "{colors.drafting-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.chip}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.drafting-blue-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.chip}"
    padding: "10px 16px"
  button-ghost-hover:
    textColor: "{colors.ink}"
  feature-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
---

# Design System: Nimbus

## Overview

**Creative North Star: "The Graph Paper Studio"**

Nimbus reads like a drafting table left on at night: a near-black workspace, one precise blue for anything actionable, and a faint ruled grid on the landing page that ties the product's identity to the craft of building. Nothing here is decorative — the interface is a tool, not a showroom, and every visual choice (flat surfaces, hairline dividers, monospace chrome) reinforces that this is a place for making things, not a marketing surface pretending to be one. It deliberately does not chase the bright, colorful, rounded-corner SaaS look common to competitor dev-tool landing pages (CodeSandbox, Replit); it stays closer to the terminal and the editor it contains.

Depth is conveyed entirely through tone steps and 1px hairlines, never shadows — three background layers (base → surface → elevated) plus consistent `line`/`line-strong` borders separate every pane, card, and tab. Motion is restrained but not absent: it exists specifically to make the interface feel snappy and responsive at the moment of interaction — a tap scale on rows and buttons, a spring-driven chevron rotation, a sliding active-tab underline — always gated behind `prefers-reduced-motion`.

**Key Characteristics:**
- Near-black, three-step tonal surface system with zero shadows
- A single accent color (Drafting Blue) used only for actionable/active state, never decoration
- Monospace type for anything IDE-chrome (tree rows, tabs); system sans for prose and headings
- Motion exists to confirm interaction (spring taps, sliding indicators), not to entertain
- A faint architectural grid backdrop as the only ornamental element, confined to the landing hero

## Colors

The palette is almost monochrome by design: three near-black tones for surfaces, three greys for text, and exactly one accent color that is rationed to actionable moments.

### Primary
- **Drafting Blue** (`#3b82f6`): the only accent in the system. Used on primary CTAs, the active-tab underline, focus rings, and folder/file active states. Its hover step, **Drafting Blue, Raised** (`#5b9bf5`), lightens on interaction.

### Neutral
- **Void Base** (`#181818`): the outermost app background (`body`, `.project-playground`, editor tab bar rest state).
- **Panel Surface** (`#1e1e1e`): one tone up — the editor pane background, active tab background, feature-card fill.
- **Elevated Chip** (`#2a2a2a`): the topmost tone step — used for hover fills on close buttons and other small interactive chips, and doubles as the default hairline color (`line`).
- **Hairline Strong** (`#3a3a3d`): a slightly brighter hairline reserved for hover/active chrome states (e.g. a feature card border on hover).
- **Ink** (`#e6e6e6`): primary text.
- **Ink, Dimmed** (`#9a9a9a`): secondary text — hero value prop, feature card body copy, inactive-but-expanded tree text.
- **Ink, Faint** (`#7a7a7a`): the quietest text step — chevrons at rest, inactive tab labels.
- **Success** (`#3fb950`) / **Danger** (`#f85149`): reserved status colors carried from `tokens.css`; not yet exercised by any documented component.

### Named Rules
**The One Accent Rule.** Drafting Blue is the only color in the system that signals "this is active or actionable." It never appears as decoration — only on a primary CTA, an active indicator, or a focus ring.

## Typography

**Display/Body Font:** `system-ui, -apple-system, 'Segoe UI', sans-serif`
**Label/Mono Font:** `'Fira Code', ui-monospace, monospace`

**Character:** A plain system sans carries all prose and headings — there is no custom display face, which keeps the product feeling like infrastructure rather than a branded product. Fira Code is reserved for anything that represents actual IDE chrome (file names, tab labels, tree rows), reinforcing that those surfaces are extensions of the code itself.

### Hierarchy
- **Display** (weight 600, 56px / 1.02 line-height, `-0.03em` tracking; 38px on mobile): the Nimbus wordmark in the landing hero — the only place this size is used.
- **Title** (weight 600, 15px, `-0.01em` tracking): header logo text and feature-card titles.
- **Body** (weight 400, 18px / 1.55, max-width 34rem): the hero value proposition — the only large-body-copy moment in the system.
- **Body, small** (weight 400, 13.5px / 1.55): feature-card descriptions.
- **Label, mono** (12.5px, mono, no letter-spacing): editor tab labels, 32px-tall tab bar.
- **Tree row, mono** (13px, mono, 24px row height, 14px indent per depth level): file tree rows.

### Named Rules
**The Mono-Means-Code Rule.** Monospace type is reserved for surfaces that represent the file system or open files (tree rows, tabs). Everything else — headings, prose, buttons — uses the system sans, even inside the IDE chrome.

## Layout

The landing page is a single-column hero (`max-w-3xl`) followed by a three-column feature grid (`max-w-5xl`, collapsing to one column below `sm`), both inset with generous horizontal padding (24px mobile, 40px desktop) and no visible container border. The IDE workspace (`ProjectPlayground`) is a fixed-height (100vh) three-pane layout — file tree, editor, terminal/preview — built on the Allotment resizable-panel library, so exact pane widths are user-adjustable rather than fixed by the design system. Tab and tree row density is tight and IDE-appropriate: 32px tab height, 24px tree row height, 14px indent per nesting depth.

## Elevation & Depth

Nimbus is flat by design — no `box-shadow` appears anywhere in the current implementation. Depth between panes and layers is conveyed entirely by stepping through the three background tones (`base` → `surface` → `elevated`) and by 1px hairline borders (`line`, brightening to `line-strong` on hover/active states). The one motion-based exception is a 1px hover lift (`y: -1`) on `NimbusButton`, which reads as an interaction cue rather than a depth cue.

### Named Rules
**The Flat-By-Default Rule.** Nothing casts a shadow. Every visual separation between surfaces is a tone step or a hairline, never a blur.

## Shapes

Two radius steps cover the whole system: a tight **Chip** radius (`6px`) for buttons and tree rows, and a slightly softer **Card** radius (`10px`) for the landing page's feature cards. Borders are always 1px hairlines in `line` or `line-strong`; no component uses a border heavier than 1px.

## Components

### Buttons (`NimbusButton`)
- **Shape:** chip radius (`6px`).
- **Primary:** Drafting Blue fill, white text, no border; hover raises to Drafting Blue, Raised.
- **Ghost:** transparent fill, `ink-dim` text, `line` border; hover brightens text to `ink` and border to `line-strong`.
- **Interaction:** springs up 1px on hover (`y: -1`, stiffness 420 / damping 30) and compresses on tap (`scale: 0.97`); focus shows a 2px Drafting Blue ring offset from the `base` background.

### Tree rows (`TreeRow`)
- **Style:** full-width row, 24px tall, mono type, chevron (folders) or `FileIcon` (files) at 14px indent per depth level.
- **State:** inactive/collapsed rows sit at `ink-dim`; an expanded folder or its label brightens to `ink`. Hover washes the row with `bg-hover` (a 4.5%-opacity white wash) and brightens text to `ink`.
- **Motion:** the folder chevron rotates 90° on expand via a spring (stiffness 500 / damping 34); rows compress slightly (`scale: 0.995`) on tap.

### Editor tabs (`EditorTab`)
- **Style:** 32px tall, mono label, right-hand hairline divider; active tab lifts to `surface` background and `ink` text, inactive tabs sit on `base` at `ink-faint`.
- **Active indicator:** a 2px Drafting Blue underline that slides between tabs via a shared `layoutId`, spring-driven (stiffness 480 / damping 38).
- **Close control:** a small `×` chip, invisible at rest on inactive tabs and revealed on hover/focus, always visible on the active tab.

### Cards (`FeatureHighlights`)
- **Corner style:** card radius (`10px`).
- **Background:** `surface` at 70% opacity.
- **Border:** 1px `line`, brightening to `line-strong` on hover.
- **Internal padding:** 20px (`p-5`).

### Grid backdrop (`GridBackdrop`) — signature element
A static, non-animated graph-paper texture: a fine 28px grid layered under a stronger 140px grid, both at low opacity (3.5%/6% white), masked with a radial gradient so it fades out toward the bottom of the viewport. It is the one purely ornamental element in the system and is confined to the landing hero — it does not appear inside the IDE workspace.

## Do's and Don'ts

### Do:
- **Do** ration Drafting Blue to actionable/active moments only — CTAs, active indicators, focus rings.
- **Do** convey depth with tone steps and hairlines (`base` → `surface` → `elevated`, `line` → `line-strong`), never shadows.
- **Do** use Fira Code only for tree rows and tabs; use the system sans everywhere else, including button and heading text inside the IDE chrome.
- **Do** gate every animation behind `useReducedMotion()` so a reduced-motion preference removes all spring/slide/fade behavior instantly.

### Don't:
- **Don't** introduce `box-shadow` anywhere — the system is flat by rule, not by accident.
- **Don't** reach for bright, saturated, or multi-color palettes reminiscent of playful SaaS dev-tool landing pages (CodeSandbox/Replit-style) — Nimbus stays close to a terminal's restraint.
- **Don't** let the grid backdrop (or any purely decorative texture) migrate into the IDE workspace panes — it is a landing-page-only signature, not a global background.
- **Don't** use a radius outside the two established steps (`6px` chip / `10px` card).
