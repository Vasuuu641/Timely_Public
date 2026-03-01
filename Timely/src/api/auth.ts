import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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
  refresh_token: string; // Refresh token
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
    // Store both tokens
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const refreshAccessToken = async (userId: string): Promise<LoginResponse> => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) throw new Error('No refresh token available');

  const response = await axios.post<LoginResponse>(`${API_URL}/auth/refresh`, {
    userId,
    refresh_token,
  });

  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  return response.data;
};

export const logoutUser = async () => {
  await axios.post(`${API_URL}/auth/logout`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  });
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};