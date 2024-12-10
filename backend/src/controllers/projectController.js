import createProjectService from "../services/projectService.js";

export const createProjectController = async (req, res) => {
   const projectId = await createProjectService();

    return res.json({
        message: 'Project created',
        data: projectId
    });
};
