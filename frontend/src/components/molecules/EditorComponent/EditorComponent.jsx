import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';

export const EditorComponent = () => {

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
        const editorContent = value;
        editorSocket.emit('writeFile', {
            data: editorContent,
            pathToFileOrFolder: activeFileTab.path
        })
    }

    useEffect(() => {
        downloadTheme();
    }, []);

    return (
        <>
            {editorState.theme &&
                <Editor 
                    height={'100vh'}
                    width={'100%'}
                    defaultLanguage='javascript'
                    defaultValue='// Welcome to the playground'
                    options={{
                        fontSize: 18,
                        fontFamily: 'Code New Roman'
                    }}
                    onChange={handleChange}
                    value={activeFileTab?.value ? activeFileTab.value : '// Welcome to the playground'}
                    onMount={handleEditorTheme}
                />
            }
        </>
    )
}