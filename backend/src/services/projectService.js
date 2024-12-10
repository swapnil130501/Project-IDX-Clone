import { execPromisified } from '../utils/execUtility.js';
import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js';
import fs from 'fs/promises';
import uuid4 from 'uuid4';

const createProjectService = async () => {
    // create a unique id and then inside the project folder create a new folder with that id
    const projectId = uuid4();
    console.log("New project id is", projectId);

    await fs.mkdir(`./projects/${projectId}`);

    // after this call the npm create vite command in the newly created project folder
    const response = await execPromisified(REACT_PROJECT_COMMAND, {
        cwd: `./projects/${projectId}`
    });

    return projectId;
}

export default createProjectService;