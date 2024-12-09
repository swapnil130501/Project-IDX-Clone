import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';

export const EditorComponent = () => {

    const [editorState, setEditorState] = useState({
        theme: null
    });

    const { editorSocket } = useEditorSocketStore();
    const { activeFileTab, setActiveFileTab } = useActiveFileTabStore();

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        console.log(data);
        setEditorState({ ...editorState, theme: data });
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    }

    useEffect(() => {
        if (editorSocket) {
            editorSocket.on('readFileSuccess', (data) => {
                console.log('read file success', data);
                setActiveFileTab(data.path, data.value);
            });

            // Clean up event listeners on unmount
            return () => {
                editorSocket.off('readFileSuccess');
            };
        }
    }, [editorSocket]);

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
                    value={activeFileTab?.value ? activeFileTab.value : '// Welcome to the playground'}
                    onMount={handleEditorTheme}
                />
            }
        </>
    )
}