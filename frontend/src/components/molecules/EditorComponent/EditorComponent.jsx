import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { extensionToFileType } from '../../../utils/extensionToFile';
import { useTreeStructureStore } from '../../../store/treeStructureStore';

export const EditorComponent = () => {

    let timerId = null;
    const [editorState, setEditorState] = useState({
        theme: null
    });

    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket } = useEditorSocketStore();
    const { projectId } = useTreeStructureStore();

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
            console.log("activeFileTab path:", activeFileTab?.path);
            editorSocket.emit('writeFile', {
                data: editorContent,
                pathToFileOrFolder: activeFileTab.path,
                projectId: projectId
            })
        }, 2000)
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
                    defaultLanguage={undefined}
                    defaultValue='// Welcome to the playground'
                    options={{
                        fontSize: 18,
                        fontFamily: 'Code New Roman'
                    }}
                    language={extensionToFileType(activeFileTab?.extension)}
                    onChange={handleChange}
                    value={activeFileTab?.value ? activeFileTab.value : '// Welcome to the playground'}
                    onMount={handleEditorTheme}
                />
            }
        </>
    )
}