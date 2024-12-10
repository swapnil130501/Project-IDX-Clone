import React from 'react'
import { useParams } from 'react-router-dom';
import { EditorComponent } from '../components/molecules/EditorComponent/EditorComponent';
import EditorButton from '../components/atoms/EditorButton/EditorButton';

function ProjectPlayground() {
    const { projectId } = useParams();

    return (
        <>
            <div>{projectId}</div>
            <EditorComponent />
            <EditorButton/>
        </>
    )
}

export default ProjectPlayground