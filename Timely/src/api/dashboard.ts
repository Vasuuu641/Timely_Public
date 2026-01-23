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
  dueDate: Date | null; 
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
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
  console.log("Dashboard component rendered");

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found!');

    const response = await axios.get<DashboardResponse>(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // This log will tell you the raw format of dueDate
    console.log("RAW dueDates:", response.data.upcomingTasks.map(t => t.dueDate));

    const dashboardData = response.data;

    const parseDate = (value: any): Date => {
      if (!value) return new Date(0);

      if (typeof value === "string") {
        return new Date(value);
      }

      if (typeof value === "number") {
        // seconds vs milliseconds
        if (value < 1e12) return new Date(value * 1000);
        return new Date(value);
      }

      return new Date(value);
    };

    return {
      ...dashboardData,
      upcomingTasks: dashboardData.upcomingTasks
      .filter(task => task.dueDate !== null)
      .map(task => ({
        ...task,
        dueDate: parseDate((task as any).dueDate),
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
