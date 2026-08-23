# IDE Workspace UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme the `ProjectPlayground` IDE workspace to a Cursor-style neutral-dark chrome via a CSS token system, and fix three structural gaps: no top toolbar, no working multi-file tab bar, and a manually-gated (rather than automatic) browser preview.

**Architecture:** Introduce `src/styles/tokens.css` as the single source of color/spacing/font values, consumed via `var(--token)` everywhere. Build two new components (`Toolbar`, `FileTabs`) and rework two existing broken/inline-styled ones (`EditorButton`, `Browser`), backed by two small Zustand store additions (`openTabs` state on the existing `activeFileTabStore`, and a new `previewReloadStore`). Wire everything into `ProjectPlayground.jsx` last.

**Tech Stack:** React 18, Vite, Zustand (state), plain CSS with custom properties (no CSS-in-JS, no Tailwind, no antd for this surface), `react-icons` for icons, `allotment` for resizable panes.

**Spec:** `docs/superpowers/specs/2026-08-23-ide-workspace-ui-redesign-design.md`

## Global Constraints

- Chrome (sidebar, tabs, terminal, toolbar, browser pane) uses the neutral-dark token palette; the Monaco editor's Dracula syntax theme (`Dracula.json`) is untouched.
- No new dependencies — everything is built with what's already in `package.json`.
- No automated test suite exists in this repo (confirmed: no test runner in `package.json`, no `*.test.*`/`*.spec.*` files). Verification per task is: `npm run lint`, `npm run build`, and a manual check against `http://localhost:5173` (dev server already running in this session).
- `CreateProject`/landing page, backend, and auth are out of scope — do not touch `src/pages/CreateProject.jsx` or `src/pages/CreateProject.css`.
- Ant Design's styled components (`Input`, `Row`, etc.) are removed from this surface; `@ant-design/icons`/`antd` package itself can stay in `package.json` (other surfaces may still use it) but must not be imported by any file this plan touches, except where a task explicitly says otherwise.

---

## Task 1: Design tokens foundation

**Files:**
- Create: `frontend/src/styles/tokens.css`
- Modify: `frontend/src/index.css`

**Interfaces:**
- Produces: a CSS custom-property contract on `:root` — `--bg-base`, `--bg-surface`, `--bg-elevated`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--accent-hover`, `--success`, `--danger`, `--font-mono`, `--font-ui`, `--space-1`..`--space-4`, `--radius`. Every later task's CSS references these exact names.

- [ ] **Step 1: Create the tokens file**

```css
/* frontend/src/styles/tokens.css */
:root {
  --bg-base: #181818;
  --bg-surface: #1e1e1e;
  --bg-elevated: #2a2a2a;
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

- [ ] **Step 2: Import it from `index.css`**

Replace the full contents of `frontend/src/index.css` with:

```css
@import './styles/tokens.css';

* {
    margin: 0;
    padding: 0;
}

body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: var(--font-ui);
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` (from `frontend/`)
Expected: build succeeds with no errors.

Open `http://localhost:5173/` — the landing page background may shift slightly (it already used a similar dark hex, `#121212`, unaffected since `CreateProject.css` isn't touched); confirm nothing is broken/blank.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/styles/tokens.css frontend/src/index.css
git commit -m "feat: add IDE workspace design tokens"
```

---

## Task 2: Preview reload store + Toolbar component

**Files:**
- Create: `frontend/src/store/previewReloadStore.js`
- Create: `frontend/src/components/organisms/Toolbar/Toolbar.jsx`
- Create: `frontend/src/components/organisms/Toolbar/Toolbar.css`

**Interfaces:**
- Consumes: `usePortStore` (`frontend/src/store/portStore.js`) — existing `{ port }` state, no changes needed to that file.
- Produces:
  - `usePreviewReloadStore()` → `{ reloadCount: number, triggerReload: () => void }`. `reloadCount` increments by 1 each call to `triggerReload`. Task 5 (`Browser.jsx`) consumes this.
  - `Toolbar` component, default export from `Toolbar.jsx`, props: `{ onReloadPreview: () => void }`. Task 4 renders it.

- [ ] **Step 1: Create the reload-trigger store**

```js
// frontend/src/store/previewReloadStore.js
import { create } from 'zustand';

export const usePreviewReloadStore = create((set) => ({
    reloadCount: 0,
    triggerReload: () => set((state) => ({ reloadCount: state.reloadCount + 1 })),
}));
```

- [ ] **Step 2: Create the Toolbar component**

```jsx
// frontend/src/components/organisms/Toolbar/Toolbar.jsx
import { useParams } from 'react-router-dom';
import { VscRefresh } from 'react-icons/vsc';
import { usePortStore } from '../../../store/portStore';
import './Toolbar.css';

function Toolbar({ onReloadPreview }) {
    const { projectId } = useParams();
    const { port } = usePortStore();

    return (
        <div className="toolbar">
            <span className="toolbar-project-name">{projectId}</span>
            <div className="toolbar-spacer" />
            <span className={`toolbar-status ${port ? 'toolbar-status-running' : 'toolbar-status-idle'}`}>
                {port ? 'Running' : 'Starting…'}
            </span>
            <button
                className="toolbar-icon-button"
                onClick={onReloadPreview}
                title="Reload preview"
                aria-label="Reload preview"
            >
                <VscRefresh />
            </button>
        </div>
    );
}

export default Toolbar;
```

- [ ] **Step 3: Style the toolbar**

```css
/* frontend/src/components/organisms/Toolbar/Toolbar.css */
.toolbar {
    display: flex;
    align-items: center;
    height: 40px;
    flex-shrink: 0;
    padding: 0 var(--space-3);
    background-color: var(--bg-base);
    border-bottom: 1px solid var(--border-subtle);
    font-family: var(--font-ui);
    font-size: 13px;
    color: var(--text-primary);
}

.toolbar-project-name {
    font-weight: 600;
}

.toolbar-spacer {
    flex: 1;
}

.toolbar-status {
    margin-right: var(--space-3);
    font-size: 12px;
    color: var(--text-muted);
}

.toolbar-status-running {
    color: var(--success);
}

.toolbar-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    width: 28px;
    height: 28px;
    border-radius: var(--radius);
    cursor: pointer;
}

.toolbar-icon-button:hover {
    background-color: var(--bg-elevated);
    color: var(--text-primary);
}
```

- [ ] **Step 4: Verify**

Run: `npm run lint` (from `frontend/`)
Expected: no new errors from these three files.

Run: `npm run build`
Expected: succeeds (Toolbar isn't rendered anywhere yet, so no visual check applies here — that happens in Task 4).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/store/previewReloadStore.js frontend/src/components/organisms/Toolbar/
git commit -m "feat: add preview reload store and Toolbar component"
```

---

## Task 3: File tabs — store, EditorButton rework, FileTabs component

**Files:**
- Modify: `frontend/src/store/activeFileTabStore.js`
- Modify: `frontend/src/components/atoms/EditorButton/EditorButton.jsx`
- Modify: `frontend/src/components/atoms/EditorButton/EditorButton.css`
- Create: `frontend/src/components/molecules/FileTabs/FileTabs.jsx`
- Create: `frontend/src/components/molecules/FileTabs/FileTabs.css`

**Interfaces:**
- Consumes: nothing new from earlier tasks (uses tokens from Task 1).
- Produces:
  - `useActiveFileTabStore()` → `{ activeFileTab: {path, name, extension, value} | null, openTabs: Array<{path, name, extension, value}>, setActiveFileTab: (path, value, extension) => void, activateTab: (path) => void, closeTab: (path) => void }`. `setActiveFileTab` keeps its existing signature (called by `editorSocketStore.js`'s `readFileSuccess` handler — unchanged) but now also upserts the file into `openTabs`.
  - `EditorButton` default export, props: `{ label: string, isActive: boolean, onClick: () => void, onClose: () => void }`.
  - `FileTabs` default export, renders one `EditorButton` per open tab; consumed by Task 4.

- [ ] **Step 1: Rework the store to track open tabs**

```js
// frontend/src/store/activeFileTabStore.js
import { create } from 'zustand';

export const useActiveFileTabStore = create((set, get) => ({
    activeFileTab: null,
    openTabs: [],

    setActiveFileTab: (path, value, extension) => {
        const name = path.split('/').pop();
        const tab = { path, name, extension, value };

        set((state) => {
            const existingIndex = state.openTabs.findIndex((t) => t.path === path);
            const openTabs = existingIndex === -1
                ? [...state.openTabs, tab]
                : state.openTabs.map((t, i) => (i === existingIndex ? tab : t));

            return { activeFileTab: tab, openTabs };
        });
    },

    activateTab: (path) => {
        const tab = get().openTabs.find((t) => t.path === path);
        if (tab) {
            set({ activeFileTab: tab });
        }
    },

    closeTab: (path) => {
        set((state) => {
            const closingIndex = state.openTabs.findIndex((t) => t.path === path);
            if (closingIndex === -1) {
                return state;
            }

            const openTabs = state.openTabs.filter((t) => t.path !== path);
            let activeFileTab = state.activeFileTab;

            if (state.activeFileTab?.path === path) {
                const fallbackIndex = Math.max(0, closingIndex - 1);
                activeFileTab = openTabs[fallbackIndex] ?? null;
            }

            return { openTabs, activeFileTab };
        });
    },
}));
```

- [ ] **Step 2: Fix and repurpose `EditorButton` as a presentational tab**

```jsx
// frontend/src/components/atoms/EditorButton/EditorButton.jsx
import './EditorButton.css';

function EditorButton({ label, isActive, onClick, onClose }) {
    function handleClose(e) {
        e.stopPropagation();
        onClose();
    }

    return (
        <button
            className={`editor-button${isActive ? ' editor-button-active' : ''}`}
            onClick={onClick}
        >
            <span className="editor-button-label">{label}</span>
            <span className="editor-button-close" onClick={handleClose}>×</span>
        </button>
    );
}

export default EditorButton;
```

This removes the hardcoded `"file.js"` text, the `console.log`-only `onClick`, and the invalid `borderTop: 'border-top: 2px solid #f7b9dd'` inline value (a CSS property value can't contain a property declaration — it was silently ignored by the browser).

- [ ] **Step 3: Restyle it with tokens**

```css
/* frontend/src/components/atoms/EditorButton/EditorButton.css */
.editor-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    outline: none;
    background-color: var(--bg-base);
    border: none;
    border-right: 1px solid var(--border-subtle);
    border-top: 2px solid transparent;
    font-size: 13px;
    font-family: var(--font-mono);
    height: 34px;
    color: var(--text-secondary);
    padding: 0 var(--space-3);
    cursor: pointer;
}

.editor-button-active {
    background-color: var(--bg-surface);
    color: var(--text-primary);
    border-top: 2px solid var(--accent);
}

.editor-button-close {
    color: var(--text-muted);
    padding: 0 2px;
    line-height: 1;
}

.editor-button-close:hover {
    color: var(--text-primary);
}
```

- [ ] **Step 4: Create `FileTabs`**

```jsx
// frontend/src/components/molecules/FileTabs/FileTabs.jsx
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import EditorButton from '../../atoms/EditorButton/EditorButton';
import './FileTabs.css';

function FileTabs() {
    const { openTabs, activeFileTab, activateTab, closeTab } = useActiveFileTabStore();

    if (openTabs.length === 0) {
        return null;
    }

    return (
        <div className="file-tabs">
            {openTabs.map((tab) => (
                <EditorButton
                    key={tab.path}
                    label={tab.name}
                    isActive={activeFileTab?.path === tab.path}
                    onClick={() => activateTab(tab.path)}
                    onClose={() => closeTab(tab.path)}
                />
            ))}
        </div>
    );
}

export default FileTabs;
```

```css
/* frontend/src/components/molecules/FileTabs/FileTabs.css */
.file-tabs {
    display: flex;
    flex-shrink: 0;
    background-color: var(--bg-base);
    border-bottom: 1px solid var(--border-subtle);
    overflow-x: auto;
}
```

- [ ] **Step 5: Verify**

Run: `npm run lint` && `npm run build`
Expected: both succeed. `FileTabs` isn't rendered yet (Task 4 wires it in), so this is a static check only — confirm no import errors and no lint violations in the five changed/created files.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/store/activeFileTabStore.js frontend/src/components/atoms/EditorButton/ frontend/src/components/molecules/FileTabs/
git commit -m "feat: track open file tabs and rebuild EditorButton/FileTabs"
```

---

## Task 4: Wire Toolbar + FileTabs into ProjectPlayground, retheme the shell

**Files:**
- Modify: `frontend/src/pages/ProjectPlayground.jsx`
- Modify: `frontend/src/pages/ProjectPlayground.css`
- Modify: `frontend/src/components/molecules/EditorComponent/EditorComponent.jsx`

**Interfaces:**
- Consumes: `Toolbar` (Task 2), `FileTabs` (Task 3), `usePreviewReloadStore` (Task 2).
- Produces: no new interfaces — this task only wires existing ones into the page.

- [ ] **Step 1: Render `Toolbar` and `FileTabs` in `ProjectPlayground.jsx`, remove the manual browser-load gate**

```jsx
// frontend/src/pages/ProjectPlayground.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import TreeStructure from "../components/organisms/TreeStructure/TreeStructure";
import BrowserTerminal from "../components/molecules/BrowserTerminal/BrowserTerminal";
import FileTabs from "../components/molecules/FileTabs/FileTabs";
import Toolbar from "../components/organisms/Toolbar/Toolbar";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { usePreviewReloadStore } from "../store/previewReloadStore";
import io from "socket.io-client";
import "./ProjectPlayground.css";
import { Browser } from "../components/organisms/Browser/Browser";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

function ProjectPlayground() {
    const { projectId: projectIdFromUrl } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();
    const { setEditorSocket } = useEditorSocketStore();
    const { setTerminalSocket, terminalSocket } = useTerminalSocketStore();
    const { triggerReload } = usePreviewReloadStore();

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);

            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: { projectId: projectIdFromUrl },
            });
            setEditorSocket(editorSocketConnection);

            try {
                const ws = new WebSocket(
                    "ws://localhost:4000/terminal?projectId=" + projectIdFromUrl
                );
                setTerminalSocket(ws);
            } catch (error) {
                console.log("Error initializing WebSocket:", error);
            }
        }
    }, [projectIdFromUrl, setProjectId, setEditorSocket, setTerminalSocket]);

    return (
        <div className="project-playground">
            <Toolbar onReloadPreview={triggerReload} />
            <div className="playground-body">
                <Allotment>
                    {/* Left Sidebar */}
                    <Allotment.Pane preferredSize={250} minSize={200} maxSize={400}>
                        {projectId && (
                            <div className="tree-structure">
                                <TreeStructure />
                            </div>
                        )}
                    </Allotment.Pane>

                    {/* Main Content */}
                    <Allotment.Pane>
                        <Allotment vertical>
                            {/* Editor */}
                            <Allotment.Pane preferredSize="70%" minSize={300}>
                                <div className="editor-component">
                                    <FileTabs />
                                    <EditorComponent />
                                </div>
                            </Allotment.Pane>

                            {/* Terminal */}
                            <Allotment.Pane preferredSize="30%" minSize={200}>
                                <div className="browser-terminal">
                                    <BrowserTerminal />
                                </div>
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>

                    {/* Browser */}
                    <Allotment.Pane preferredSize={300} minSize={250}>
                        <div className="browser-container">
                            {projectIdFromUrl && terminalSocket && (
                                <Browser projectId={projectIdFromUrl} />
                            )}
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
}

export default ProjectPlayground;
```

The `loadBrowser` state and the "Load my browser" button are gone — `Browser` now renders as soon as `projectIdFromUrl && terminalSocket` are ready (same condition as before, minus the click gate), and `Browser`'s own effect (unchanged in this task, reworked in Task 5) requests the port on mount.

- [ ] **Step 2: Retheme `ProjectPlayground.css` and give the shell a flex column layout for the new toolbar**

```css
/* frontend/src/pages/ProjectPlayground.css */
.project-playground {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: var(--font-mono);
    background-color: var(--bg-base);
    color: var(--text-primary);
}

.playground-body {
    flex: 1;
    min-height: 0;
}

/* Sidebar (Tree Structure) */
.tree-structure {
    background-color: var(--bg-base);
    color: var(--text-primary);
    height: 100%;
    overflow-y: auto;
    padding: var(--space-2);
    border-right: 1px solid var(--border-subtle);
}

/* Editor Component */
.editor-component {
    position: relative;
    background-color: var(--bg-surface);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Terminal */
.browser-terminal {
    background-color: var(--bg-base);
    color: var(--text-primary);
    padding: var(--space-2);
    height: 100%;
    overflow-y: auto;
    border-top: 1px solid var(--border-subtle);
}

/* Browser */
.browser-container {
    background-color: var(--bg-base);
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-subtle);
    height: 100%;
}

/* Scrollbar General Styling */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-base);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: var(--bg-elevated);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}
```

This drops the old `.browser-container button`/`input` rules (that markup no longer exists — Task 5 replaces it) and the duplicate scrollbar rules that referenced removed classes.

- [ ] **Step 3: Fix `EditorComponent`'s hardcoded `100vh` height so it fits under the new tab bar**

In `frontend/src/components/molecules/EditorComponent/EditorComponent.jsx`, the `Editor` was given a fixed `height={'100vh'}`, which made sense when it was the only thing in its pane but now overflows past `FileTabs`. Wrap it so it fills the remaining flex space of `.editor-component` instead:

```jsx
// frontend/src/components/molecules/EditorComponent/EditorComponent.jsx
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { extensionToFileType } from '../../../utils/extensionToFile';

export const EditorComponent = () => {

    let timerId = null;
    const [editorState, setEditorState] = useState({
        theme: null
    });

    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket } = useEditorSocketStore();

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        setEditorState({ ...editorState, theme: data });
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    }

    function handleChange(value) {
        if(timerId != null) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(() => {
            const editorContent = value;
            console.log('sending writeFile event')
            editorSocket.emit('writeFile', {
                data: editorContent,
                pathToFileOrFolder: activeFileTab.path
            })
        }, 2000)
    }

    useEffect(() => {
        downloadTheme();
    }, []);
    return (
        <div style={{ flex: 1, minHeight: 0 }}>
            {editorState.theme &&
                <Editor
                    height={'100%'}
                    width={'100%'}
                    defaultLanguage={undefined}
                    defaultValue='// Welcome to the playground'
                    options={{
                        fontSize: 16,
                    }}
                    language={extensionToFileType(activeFileTab?.extension)}
                    onChange={handleChange}
                    value={activeFileTab?.value ? activeFileTab.value : '// Welcome to the playground'}
                    onMount={handleEditorTheme}
                />
            }
        </div>
    )
}
```

Only the `height={'100vh'}` → `height={'100%'}` change and the new wrapping `<div style={{ flex: 1, minHeight: 0 }}>` are new; everything else is unchanged from the current file.

- [ ] **Step 4: Verify**

Run: `npm run lint` && `npm run build`
Expected: both succeed.

Manual check at `http://localhost:5173/project/<any-id>` (a 404/loading state from missing Docker is fine — we're checking layout, not data): confirm the toolbar renders full-width at the top with the project id and a spinner/refresh icon, the three-pane layout still resizes via `Allotment`, and the editor pane no longer overflows its container.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/ProjectPlayground.jsx frontend/src/pages/ProjectPlayground.css frontend/src/components/molecules/EditorComponent/EditorComponent.jsx
git commit -m "feat: wire Toolbar and FileTabs into ProjectPlayground, retheme shell"
```

---

## Task 5: Rework `Browser` — drop antd, auto-reload via store, token styling

**Files:**
- Modify: `frontend/src/components/organisms/Browser/Browser.jsx`
- Create: `frontend/src/components/organisms/Browser/Browser.css`

**Interfaces:**
- Consumes: `usePreviewReloadStore` (Task 2) — `{ reloadCount }`.
- Produces: no new interfaces; `Browser` keeps its existing `{ projectId }` prop contract used by `ProjectPlayground.jsx`.

- [ ] **Step 1: Rewrite `Browser.jsx` without antd, reacting to `reloadCount`**

```jsx
// frontend/src/components/organisms/Browser/Browser.jsx
import { useEffect, useRef } from "react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { usePortStore } from "../../../store/portStore";
import { usePreviewReloadStore } from "../../../store/previewReloadStore";
import "./Browser.css";

export const Browser = ({ projectId }) => {

    const browserRef = useRef(null);
    const isFirstRender = useRef(true);
    const { port } = usePortStore();
    const { editorSocket } = useEditorSocketStore();
    const { reloadCount } = usePreviewReloadStore();

    useEffect(() => {
        if (!port) {
            editorSocket?.emit("getPort", {
                containerName: projectId
            });
        }
    }, [port, editorSocket, projectId]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (browserRef.current) {
            const oldAddr = browserRef.current.src;
            browserRef.current.src = oldAddr;
        }
    }, [reloadCount]);

    if (!port) {
        return <div className="browser-loading">Loading preview…</div>;
    }

    return (
        <div className="browser-pane">
            <div className="browser-address-bar">{`http://localhost:${port}`}</div>
            <iframe
                ref={browserRef}
                className="browser-frame"
                src={`http://localhost:${port}`}
                title="Project preview"
            />
        </div>
    );
}
```

The reload button and its `handleRefresh` are gone from here — that action now lives in `Toolbar` (Task 2) and reaches this component through `usePreviewReloadStore`. `isFirstRender` prevents an unnecessary reload the moment the component mounts (since `reloadCount` starts at `0` and mounting shouldn't count as a manual reload).

- [ ] **Step 2: Style it**

```css
/* frontend/src/components/organisms/Browser/Browser.css */
.browser-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 13px;
}

.browser-pane {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--bg-base);
}

.browser-address-bar {
    height: 30px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 0 var(--space-2);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 12px;
    background-color: var(--bg-surface);
    border-bottom: 1px solid var(--border-subtle);
}

.browser-frame {
    flex: 1;
    border: none;
    background-color: var(--bg-base);
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint` && `npm run build`
Expected: both succeed, and `grep -r "antd" frontend/src/components/organisms/Browser/` returns nothing.

Manual check: in the running dev server, the right-hand pane shows "Loading preview…" (no Docker, so `port` never arrives) instead of the old "Load my browser" button — confirming the auto-load path is reached without a click. Click the toolbar's reload icon; no error should appear in the browser console (the `browserRef.current` guard makes it a no-op while `port` is null).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/organisms/Browser/
git commit -m "feat: rework Browser preview to auto-load and drop antd styling"
```

---

## Task 6: Retheme `Tree` — move inline styles to `Tree.css`

**Files:**
- Modify: `frontend/src/components/molecules/Tree/Tree.jsx`
- Create: `frontend/src/components/molecules/Tree/Tree.css`

**Interfaces:**
- Consumes: nothing new. No prop or store changes — `Tree` keeps its existing `{ data }` prop and all existing store usage.
- Produces: nothing new for later tasks.

- [ ] **Step 1: Replace inline `style={{...}}` objects with token-backed classes**

```jsx
// frontend/src/components/molecules/Tree/Tree.jsx
import React from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { CreateFileModal } from "../CreateInputModal/CreateFileFolderModal";
import { useCreateFileStore } from "../../../store/createFileFolderStore";
import { useExpandTreeStore } from "../../../store/expandTreeStore";
import "./Tree.css";

function Tree({ data }) {
    const { editorSocket } = useEditorSocketStore();
    const { setIsOpen: setFileContextMenuIsOpen, setX: setFileContextMenuX, setY: setFileContextMenuY, setFile } = useFileContextMenuStore();
    const { setX: setFolderContextMenuX, setY: setFolderContextMenuY, setIsOpen: setFolderContextMenuIsOpen, setFolder } = useFolderContextMenuStore();
    const { isModalOpen, folderPath, isFolderCreation } = useCreateFileStore();

    const { expand, toggleExpand, setExpanded } = useExpandTreeStore();

    function handleExpand(name) {
        toggleExpand(name);
    }

    function computeExtension(data) {
        const names = data.name.split(".");
        return names.length > 1 ? names[names.length - 1] : null;
    }

    function handleClick(data) {
        editorSocket.emit("readFile", {
            pathToFileOrFolder: data.path,
        });

        console.log("clicked");
    }

    function handleContextMenuForFile(e, path) {
        e.preventDefault();
        console.log("right click on file", path);
        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    function handleContextMenuForFolder(e, path) {
        e.preventDefault();
        console.log("right click on folder", path);
        setFolder(path);
        setFolderContextMenuX(e.clientX);
        setFolderContextMenuY(e.clientY);
        setFolderContextMenuIsOpen(true);
    }

    return (
        data && (
            <div className="tree-node">
                {data.children ? (
                    <div>
                        <button
                            className={`tree-folder-button${expand[data.name] ? ' expanded' : ''}`}
                            onClick={() => handleExpand(data.name)}
                            onContextMenu={(e) => handleContextMenuForFolder(e, data.path)}
                        >
                            <span className="tree-folder-icon">
                                {expand[data.name] ? (
                                    <IoIosArrowDown className="tree-icon-expanded" />
                                ) : (
                                    <IoIosArrowForward className="tree-icon-collapsed" />
                                )}
                            </span>
                            {data.name}
                        </button>

                        {isModalOpen && folderPath === data.path && (
                            <div>
                                <CreateFileModal isFolderCreation={isFolderCreation} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className="tree-file-row"
                        onClick={() => handleClick(data)}
                        onContextMenu={(e) => handleContextMenuForFile(e, data.path)}
                    >
                        <span className="tree-file-icon">
                            <FileIcon extension={computeExtension(data)} />
                        </span>
                        <span className="tree-file-name">{data.name}</span>
                    </div>
                )}

                {expand[data.name] &&
                    data.children?.length > 0 &&
                    data.children.map((it) => <Tree data={it} key={it.name} />)}
            </div>
        )
    );
}

export default Tree;
```

- [ ] **Step 2: Style it**

```css
/* frontend/src/components/molecules/Tree/Tree.css */
.tree-node {
    padding-left: 15px;
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-size: 13px;
    font-family: var(--font-mono);
    line-height: 1.5;
}

.tree-folder-button {
    border: none;
    cursor: pointer;
    outline: none;
    background-color: transparent;
    padding: var(--space-2) 0;
    margin-top: 5px;
    font-size: 14px;
    font-family: var(--font-mono);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    line-height: 1.5;
}

.tree-folder-button.expanded {
    color: var(--text-primary);
}

.tree-folder-icon {
    margin-right: 5px;
    display: flex;
    align-items: center;
}

.tree-icon-expanded {
    color: var(--accent);
    font-size: 14px;
}

.tree-icon-collapsed {
    color: var(--text-muted);
    font-size: 14px;
}

.tree-file-row {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-top: 5px;
    padding: 5px 0;
    border-radius: var(--radius);
}

.tree-file-row:hover {
    background-color: var(--bg-elevated);
}

.tree-file-icon {
    display: flex;
    align-items: center;
    margin-right: 5px;
}

.tree-file-name {
    font-size: 13px;
    font-family: var(--font-mono);
    line-height: 1.5;
    color: var(--text-primary);
}
```

`FileIcon.jsx` keeps its own per-language icon colors (JS yellow, CSS blue, etc.) unchanged — those are semantic file-type indicators, not workspace chrome, so they're outside this pass's token scope.

- [ ] **Step 3: Verify**

Run: `npm run lint` && `npm run build`
Expected: both succeed. `grep -n "style={{" frontend/src/components/molecules/Tree/Tree.jsx` returns nothing.

Manual check: with a project loaded (requires Docker for real data; otherwise confirm via the component rendering without console errors when `treeStructure` is empty), the tree's folder/file rows should show neutral grays with a blue accent on expanded folders instead of the old pink/purple/green.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/molecules/Tree/
git commit -m "refactor: move Tree inline styles to Tree.css using design tokens"
```

---

## Task 7: Retheme `BrowserTerminal`

**Files:**
- Modify: `frontend/src/components/molecules/BrowserTerminal/BrowserTerminal.jsx`
- Modify: `frontend/src/components/molecules/BrowserTerminal/BrowserTerminal.css`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new.

- [ ] **Step 1: Update the xterm.js theme object to the neutral palette**

In `frontend/src/components/molecules/BrowserTerminal/BrowserTerminal.jsx`, replace the `theme` object passed to `new Terminal(...)`:

```jsx
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: "#181818",
                foreground: "#e6e6e6",
                cursor: "#e6e6e6",
                cursorAccent: "#181818",
                red: "#f85149",
                green: "#3fb950",
                yellow: "#e3b341",
                cyan: "#3b82f6",
            },
            fontSize: 14,
            fontFamily: "monospace",
            convertEol: true,
        });
```

(xterm's `Terminal` constructor only accepts literal color strings, not CSS custom properties, so these are the token values copied in directly — they must be kept in sync with `tokens.css` by hand if the palette ever changes.) Every other line in the file is unchanged.

- [ ] **Step 2: Update the CSS**

```css
/* frontend/src/components/molecules/BrowserTerminal/BrowserTerminal.css */
.terminal {
    width: 100%;
    height: 100%;
    background-color: var(--bg-base);
    font-family: var(--font-mono);
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint` && `npm run build`
Expected: both succeed.

Manual check: the terminal pane's background now matches the rest of the neutral chrome (previously it was a slightly different purple-black, `#282a37`, than the surrounding `#21222c`/`#1e1e2e` panes — now everything shares `--bg-base`).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/molecules/BrowserTerminal/
git commit -m "refactor: retheme BrowserTerminal to design tokens"
```

---

## Final check

- [ ] Run `npm run lint` and `npm run build` from `frontend/` one more time after all seven tasks — both must be clean.
- [ ] `grep -rn "#bd93f9\|#ff79c6\|#8be9fd\|#50fa7b\|#6272a4\|#282a36\|#21222c\|#1e1e2e\|#f8f8f2" frontend/src/pages frontend/src/components` — should return no matches outside `CreateProject.css` (out of scope) and `Dracula.json`/editor syntax theme references, confirming the old Dracula chrome hex values are gone from the workspace chrome.
- [ ] With the dev server running, click through: expand/collapse a tree folder, open a file (requires Docker), open a second file, switch tabs, close a tab, click the toolbar reload icon — no console errors.
