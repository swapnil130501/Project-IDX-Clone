import Editor from '@monaco-editor/react';
import { VscFileCode } from 'react-icons/vsc';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { extensionToFileType } from '../../../utils/extensionToFile';

// Nimbus's own Monaco theme: near-black surfaces, one accent (Drafting Blue)
// for keywords/cursor/selection, and a restrained syntax palette so opening
// a file doesn't drop the visitor into an unrelated editor theme.
const NIMBUS_MONACO_THEME = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'comment', foreground: '7a7a7a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '3b82f6' },
        { token: 'storage', foreground: '3b82f6' },
        { token: 'string', foreground: 'c9a26d' },
        { token: 'constant.numeric', foreground: '9d8cd9' },
        { token: 'constant.language', foreground: '9d8cd9' },
        { token: 'constant.other', foreground: '9d8cd9' },
        { token: 'entity.name.function', foreground: 'e6e6e6', fontStyle: 'bold' },
        { token: 'entity.name.tag', foreground: '3b82f6' },
        { token: 'entity.other.attribute-name', foreground: '9a9a9a' },
        { token: 'entity.name.class', foreground: '9a9a9a', fontStyle: 'italic' },
        { token: 'entity.name.type', foreground: '9a9a9a', fontStyle: 'italic' },
        { token: 'variable.parameter', foreground: 'e6e6e6', fontStyle: 'italic' },
        { token: 'support.function', foreground: 'e6e6e6' },
        { token: 'invalid', foreground: 'f85149' },
    ],
    colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#e6e6e6',
        'editorCursor.foreground': '#3b82f6',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editor.selectionBackground': '#3b82f640',
        'editor.selectionHighlightBackground': '#3b82f61f',
        'editor.wordHighlightBackground': '#3b82f61f',
        'editor.findMatchBackground': '#3b82f659',
        'editor.findMatchHighlightBackground': '#3b82f62e',
        'editorLineNumber.foreground': '#7a7a7a',
        'editorLineNumber.activeForeground': '#9a9a9a',
        'editorIndentGuide.background': '#2a2a2a',
        'editorIndentGuide.activeBackground': '#3a3a3d',
        'editorWhitespace.foreground': '#2a2a2a',
        'editorGutter.background': '#1e1e1e',
        'editorBracketMatch.background': '#3b82f626',
        'editorBracketMatch.border': '#3b82f6',
        'editorWidget.background': '#2a2a2a',
        'editorWidget.border': '#3a3a3d',
        'editorSuggestWidget.background': '#2a2a2a',
        'editorSuggestWidget.selectedBackground': '#3b82f62e',
        'editorSuggestWidget.border': '#3a3a3d',
        'scrollbarSlider.background': '#ffffff0f',
        'scrollbarSlider.hoverBackground': '#ffffff1a',
        'scrollbarSlider.activeBackground': '#ffffff26',
    },
};

export const EditorComponent = () => {

    let timerId = null;

    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket } = useEditorSocketStore();

    function handleEditorWillMount(monaco) {
        monaco.editor.defineTheme('nimbus', NIMBUS_MONACO_THEME);
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

    if (!activeFileTab) {
        return (
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 bg-surface text-ink-faint">
                <VscFileCode size={28} aria-hidden="true" />
                <p className="font-ui text-[13px]">Select a file to start editing</p>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
                height={'100%'}
                width={'100%'}
                theme="nimbus"
                beforeMount={handleEditorWillMount}
                defaultLanguage={undefined}
                defaultValue='// Welcome to the playground'
                options={{
                    fontSize: 16,
                }}
                language={extensionToFileType(activeFileTab?.extension)}
                onChange={handleChange}
                value={activeFileTab?.value ? activeFileTab.value : '// Welcome to the playground'}
            />
        </div>
    )
}
