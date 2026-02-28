import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export type PomodoroLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface PomodoroSession {
  id: number;
  userId: string;
  level: PomodoroLevel;
  focusStart: string;
  focusEnd?: string;
  pointsEarned: number;
  isCompleted: boolean;
  totalBreakMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Break {
  id: number;
  sessionId: number;
  startTime: string;
  endTime?: string;
  createdAt: string;
}

export interface CreateSessionResponse extends PomodoroSession {}

export interface StartBreakResponse {
  message: string;
  break: Break;
}

export interface EndBreakResponse {
  message: string;
  break: Break;
}

export interface EndSessionResponse {
  message: string;
  session: PomodoroSession;
  duration: string;
  points: number;
  complianceTier: 'FULL' | 'PARTIAL' | 'MINIMUM' | 'FAIL';
  warnings: string[];
}

export interface TodayStatsResponse {
  pointsToday: number;
  sessionsCompleted: number;
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

export const createPomodoroSession = async (
  level: PomodoroLevel
): Promise<CreateSessionResponse> => {
  try {
    const response = await axios.post<CreateSessionResponse>(
      `${API_URL}/start`,
      { level },
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const startBreak = async (sessionId: number): Promise<StartBreakResponse> => {
  try {
    const response = await axios.post<StartBreakResponse>(
      `${API_URL}/start-break`,
      { sessionId },
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const endBreak = async (breakId: number): Promise<EndBreakResponse> => {
  try {
    const response = await axios.post<EndBreakResponse>(
      `${API_URL}/end-break`,
      { breakId },
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const endPomodoroSession = async (
  sessionId: number
): Promise<EndSessionResponse> => {
  try {
    const response = await axios.post<EndSessionResponse>(
      `${API_URL}/end`,
      { sessionId },
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
export const getTodayStats = async (): Promise<TodayStatsResponse> => {
  try {
    const response = await axios.get<TodayStatsResponse>(
      `${API_URL}/today-stats`,
      getAxiosConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};