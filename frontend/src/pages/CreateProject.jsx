import React from 'react';
import useCreateProject from '../hooks/apis/mutations/useCreateProject';
import { Button, Layout, Card } from 'antd';
import './CreateProject.css';
import { useNavigate } from 'react-router-dom';

function CreateProject() {
    const { createProjectMutation } = useCreateProject();
    const { Header, Footer, Content } = Layout;

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
        <Layout className="layout">
            <Card className="card">
                <div className="header">Create a New React Project</div>
                <Content className="content">
                    Start your development journey with our powerful, streamlined tools.
                </Content>
                <Button onClick={handleCreateProject}>Create Playground</Button>
                <Footer className="footer">© 2024 My React App. All rights reserved.</Footer>
            </Card>
        </Layout>
    );
}

export default CreateProject;
