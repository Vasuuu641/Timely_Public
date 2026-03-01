import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

export interface TodaySummary {
  tasksDone: number;
  focusSessions: number;
  studyTime: number;
  completionPercentage: number;
  totalPointsToday: number;
  studyGoals: Array<{
    id: string;
    type: string;
    target: number;
    notes: string;
  }>;
}

export interface DailyReview {
  id: number;
  date: string;
  reflection: string;
  rating: number | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  date?: string;
  reflection: string;
  rating?: number;
}

export interface UpdateReviewDto {
  reflection?: string;
  rating?: number;
}

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found. Please login first.');
  }
  return token;
};

const getAxiosConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
};

export const getTodaySummary = async (): Promise<TodaySummary> => {
  try {
    const response = await axios.get<TodaySummary>(
      `${API_URL}review/summary/today`,
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getTodayReview = async (): Promise<DailyReview> => {
  try {
    const response = await axios.get<DailyReview>(
      `${API_URL}review/today`,
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const createReview = async (dto: CreateReviewDto): Promise<DailyReview> => {
  try {
    const response = await axios.post<DailyReview>(
      `${API_URL}review`,
      dto,
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updateReview = async (
  id: number,
  dto: UpdateReviewDto
): Promise<DailyReview> => {
  try {
    const response = await axios.patch<DailyReview>(
      `${API_URL}review/${id}`,
      dto,
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    console.error('Update review error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const getReviewHistory = async (
  skip: number = 0,
  take: number = 10
): Promise<DailyReview[]> => {
  try {
    const response = await axios.get<DailyReview[]>(
      `${API_URL}/history?skip=${skip}&take=${take}`,
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const deleteReview = async (id: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/${id}`,
      getAxiosConfig()
    );
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
