import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface RegisterData {
    email: string;
    username: string;
    fullname: string;
    password: string;
}
interface RegisterResponse {
    message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string; // JWT token
}

export const registerUser = async (data: RegisterData) => {
    try {
        const response = await axios.post<RegisterResponse>(`${API_URL}/user`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Login existing user
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};