# IDE Workspace UI Redesign

**Date:** 2026-08-23
**Scope:** `frontend/` — the `ProjectPlayground` IDE workspace only. The `CreateProject` landing page, backend, auth, and multi-user features are explicitly out of scope for this pass.

## Background

The current `ProjectPlayground` view (3-pane `Allotment` layout: file tree / editor+terminal / browser preview) uses a Dracula-derived dark palette applied inconsistently — colors are hardcoded as hex literals scattered across `.css` files and inline `style={{...}}` objects in `Tree.jsx` and `Browser.jsx`. There is no top toolbar, no working multi-file tab bar (`EditorButton` exists but is hardcoded to display `"file.js"`, its `onClick` only logs to console, it is not rendered anywhere, and its `isActive` style has an invalid `borderTop` value), and the browser preview only loads after a manual "Load my browser" button click.

## Visual direction

Adopt a Cursor-style neutral dark theme for the workspace **chrome** (sidebar, tabs, terminal, toolbar, browser pane): near-black/charcoal backgrounds, thin subtle borders instead of heavy contrast blocks, muted gray text, and a single restrained blue accent color for active/focus states — replacing the current purple/pink/cyan-everywhere Dracula chrome.

The Monaco **editor's syntax highlighting** is a deliberately separate concern and keeps its existing Dracula theme (`Dracula.json`, loaded in `EditorComponent.jsx`'s `handleEditorTheme`) unchanged — decoupling "UI chrome theme" from "code syntax theme" is standard IDE practice (Cursor, VS Code, etc. do the same).

## Design tokens

New file `src/styles/tokens.css`, defined once on `:root` and imported from `index.css`:

```css
:root {
  --bg-base: #181818;       /* app shell, sidebar, terminal, toolbar */
  --bg-surface: #1e1e1e;    /* editor pane, active tab */
  --bg-elevated: #2a2a2a;   /* hover states, selected tree row, inactive tab */
  --border-subtle: #2a2a2a;
  --text-primary: #e6e6e6;
  --text-secondary: #9a9a9a;
  --text-muted: #7a7a7a;
  --accent: #3b82f6;
  --accent-hover: #5b9bf5;
  --success: #3fb950;
  --danger: #f85149;
  --font-mono: 'Fira Code', ui-monospace, monospace;
  --font-ui: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --radius: 6px;
}
```

Every workspace `.css` file (`ProjectPlayground.css`, new `Tree.css`, new `Browser.css`, `EditorButton.css`, `BrowserTerminal.css`) references these variables instead of hardcoded hex. Inline `style={{...}}` blocks that must stay dynamic (e.g. conditional active-state colors) reference `var(--token)` strings rather than literal hex.

## Components

### Toolbar (new)

`src/components/organisms/Toolbar/Toolbar.jsx` + `Toolbar.css`. Rendered above the `Allotment` in `ProjectPlayground.jsx`. Fixed height (~40px), `background: var(--bg-base)`, bottom border `1px solid var(--border-subtle)`.

Contents, left to right:
- Project identifier (from the route `projectId` — static text; no rename API exists, so editing the name is out of scope)
- Flex spacer
- Run/Stop status pill, derived from the existing `usePortStore` port value (no new backend call — reuses data the `Browser` component already consumes)
- Reload-preview icon button — the refresh logic currently living in `Browser.jsx`'s `Input` prefix moves here, since it's a workspace-level action, not a browser-pane-local one

No settings/user menu is built — there is no auth/user system in this app, so a menu with nothing behind it would be dead UI. A flex spacer is left where one would go.

### File tabs (rework of `EditorButton`)

- `atoms/EditorButton/EditorButton.jsx` is fixed: it becomes a presentational component taking `label`, `isActive`, `onClick`, `onClose` props (no more hardcoded `"file.js"`, no more console.log, no more invalid `borderTop` value — replaced with a proper conditional class or `borderTop: isActive ? '2px solid var(--accent)' : 'none'`).
- New `molecules/FileTabs/FileTabs.jsx` + `FileTabs.css` renders one `EditorButton` per open tab, with a close (×) affordance, and sits directly above `EditorComponent` inside its `Allotment.Pane` in `ProjectPlayground.jsx`.
- `store/activeFileTabStore.js` gains an `openTabs: []` array (each entry: `{ path, name, extension, value }`) alongside the existing `activeFileTab`, plus actions to add/remove/activate a tab.
- `Tree.jsx`'s `handleClick` (currently only emits `readFile`) additionally pushes the clicked file into `openTabs` if not already present, and sets it active.
- Closing a tab removes it from `openTabs`; if it was the active tab, the previous tab in the array becomes active (or the editor shows its empty/welcome state if none remain).

### Browser preview — auto-load

`ProjectPlayground.jsx` drops the `loadBrowser` boolean and its button. Instead, once `projectId` is set, it fires the `getPort` socket emit (currently gated inside `Browser.jsx` behind a click) so the preview begins loading automatically as soon as the dev server inside the project container reports its port. `Browser.jsx` keeps its existing "Loading…" fallback for the gap before the port arrives — that state is now the natural first paint rather than a manual gate.

`Browser.jsx`'s antd `Row`/`Input` are replaced with a plain `div`/`input` styled via tokens (`Browser.css`, new file) to match the neutral theme exactly instead of carrying Ant Design's default look. The reload icon (`ReloadOutlined`) moves to the new Toolbar as described above; `Browser.jsx` no longer needs an antd import.

### Tree cleanup

`Tree.jsx`'s inline `style={{...}}` objects move into a new `Tree.css`, referencing tokens. No behavioral change — this fixes styling consistency and removes the largest source of hardcoded hex values in the codebase.

## Explicitly out of scope

- `CreateProject` / landing page redesign (separate future pass)
- Any backend changes
- Auth, user accounts, settings menu
- Drag-and-drop tabs, split editor groups, multiple terminal instances
- Changing the Monaco editor's syntax theme

## Testing / verification

There is no existing automated test suite in this repo. Verification is manual:
1. Run `npm run dev` (frontend) and confirm the workspace visually matches the approved neutral-dark mockup (toolbar, tabs, tree, terminal, browser).
2. Exercise opening multiple files from the tree, switching between tabs, and closing tabs (including closing the active tab).
3. Confirm the browser preview loads automatically once a project's dev server reports a port, without needing a manual click.
4. `npm run lint` and `npm run build` stay clean.
