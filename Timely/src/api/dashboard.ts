// src/api/dashboard.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Mirror the backend response using frontend-safe interfaces
export interface DashboardStats {
  notesCreated: number;
  tasksCompleted: number;
  studyHours: number;
  pomodoroPoints: number;
}

export interface UpcomingTask {
  id: number | string;
  title: string;
  dueDate: Date; // ISO string
}
export type ActivityType = 'NOTE' | 'TASK' | 'QUIZ' | 'REVIEW' | 'POMODORO' | 'SCHEDULE';

export interface RecentActivity {
  id?: number | string;
  type: ActivityType;
  title: string;
  createdAt: Date;
}

export interface GoalProgress {
  id: string;
  type: string; // GoalType as string
  target: number;
  notes?: string;
  progress: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  upcomingTasks: UpcomingTask[];
  recentActivity: RecentActivity[];
  goals: GoalProgress[];
  quickActions: FeatureName[];
}

export type FeatureName = "NOTES" | "TODO" | "POMODORO" | "SCHEDULE" | "QUIZ" | "GOALS";


export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found!');

    const response = await axios.get<DashboardResponse>(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Convert date strings to Date objects for frontend usage
    const dashboardData = response.data;

    return {
      ...dashboardData,
      upcomingTasks: dashboardData.upcomingTasks.map(task => ({
        ...task,
        dueDate: new Date(task.dueDate),
      })),
      recentActivity: dashboardData.recentActivity.map(act => ({
        ...act,
        createdAt: new Date(act.createdAt),
      })),
    };
  } catch (error: any) {
    throw error.response?.data || error;
  }
};