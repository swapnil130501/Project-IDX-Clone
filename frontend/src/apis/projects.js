import axios from '../config/axiosConfig';

async function createProjectApi() {
    try {
        const response = await axios.post('/api/v1/projects');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default createProjectApi;
