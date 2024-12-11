import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { EditorComponent } from '../components/molecules/EditorComponent/EditorComponent';
import EditorButton from '../components/atoms/EditorButton/EditorButton';
import TreeStructure from '../components/organisms/TreeStructure/TreeStructure';
import { useTreeStructureStore } from '../store/treeStructureStore';

function ProjectPlayground() {
    const {projectId: projectIdFromUrl } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
        }
    }, [setProjectId, projectIdFromUrl]);


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
                                overflow: 'auto'
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