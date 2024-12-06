import React from 'react'
import useCreateProject from '../hooks/apis/mutations/useCreateProject'
import { Button, Layout } from 'antd';

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(50% - 8px)',
    maxWidth: 'calc(50% - 8px)'
}

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};

const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};

function CreateProject() {
    const { createProjectMutation } = useCreateProject();
    const {Header, Footer, Content} = Layout;

    async function handleCreateProject() {
        console.log("Going to trigger the api");

        try {
            await createProjectMutation();
            console.log('redirect to editor')
        } catch (error) {
            console.log('error')
        }
    }

    return (
        <Layout style={layoutStyle}>
            
            <Header style={headerStyle}>
                <h1>Create Project</h1>
            </Header>

            <Content style={contentStyle}>
                <Button onClick={handleCreateProject}>
                    Create Playground
                </Button>
            </Content>

            <Footer style={footerStyle}>
                Footer
            </Footer>

        </Layout>
    )
}

export default CreateProject
