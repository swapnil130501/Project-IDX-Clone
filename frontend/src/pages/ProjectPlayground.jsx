import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { EditorComponent } from '../components/molecules/EditorComponent/EditorComponent';
import EditorButton from '../components/atoms/EditorButton/EditorButton';
import TreeStructure from '../components/organisms/TreeStructure/TreeStructure';
import { useTreeStructureStore } from '../store/treeStructureStore';
import { useEditorSocketStore } from '../store/editorSocketStore.js';
import io from 'socket.io-client';

function ProjectPlayground() {
    const {projectId: projectIdFromUrl } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();
    const { editorSocket, setEditorSocket } = useEditorSocketStore();

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor?`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });

            setEditorSocket(editorSocketConnection);
        }
    }, [setProjectId, projectIdFromUrl, setEditorSocket]);


    return (
        <>
            <div style={{display: 'flex'}}>
                { projectId && (
                        <div 
                            style={{
                                backgroundColor: '#21222C',
                                paddingRight: '10px',
                                paddingTop: '0.3vh',
                                maxWidth: '25%',
                                minWidth: '250px',
                                height: '99.7vh',
                                overflow: 'auto',
                                border: '1px solid grey'
                            }}
                        >
                            <TreeStructure />
                        </div>
                    )}
                    <EditorComponent />
            </div>
        </>
    )
}

export default ProjectPlayground