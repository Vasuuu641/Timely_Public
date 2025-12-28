import axios from 'axios';

const API_URL = 'http://localhost:3000/user';

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData) => {
    try {
        const response = await axios.post(`${API_URL}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};