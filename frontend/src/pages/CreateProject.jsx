import React from 'react';
import useCreateProject from '../hooks/apis/mutations/useCreateProject';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';

function CreateProject() {
    const { createProjectMutation } = useCreateProject();
    const navigate = useNavigate();

    async function handleCreateProject() {
        console.log('Going to trigger the API');
        try {
            const response = await createProjectMutation();
            console.log('Redirect to editor');
            navigate(`/project/${response.data}`);
        } catch (error) {
            console.log('Error');
        }
    }

    return (
        <div className="welcome-container">
            <img className="bg-image" src="src/assets/bg-image.png" alt="Background" />
            <div className="content">
                <h1 className="title">Welcome to Project IDX</h1>
                <p className="description">
                    Project IDX is a workspace for full-stack, multiplatform app development in the cloud.
                    With support for a broad range of frameworks, languages, and services, alongside
                    integrations with your favorite Google products, IDX streamlines your development
                    workflow so you can build and ship apps across platforms with speed, ease, and quality.
                </p>
                <button className="btn" onClick={handleCreateProject}>Get Started →</button>
            </div>
        </div>
    );
}

export default CreateProject;
