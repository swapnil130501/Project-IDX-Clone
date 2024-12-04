import axios from '../config/axiosConfig';

async function pingApi() {
    try {
        const response = await axios.get('/api/v1/ping');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default pingApi;