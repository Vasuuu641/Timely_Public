import Sidebar from "../../components/Navbar/Sidebar";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../api/user";
import { NotebookPen, Timer, SquareCheckBig, Medal } from "lucide-react";
import { StatsCard } from "../../components/Dashboard_Cards/StatsCard";
import { fetchDashboardData, type DashboardStats, type FeatureName } from "../../api/dashboard";
import { QuickActionsCard } from "../../components/Dashboard_Cards/ActionsCard";
import { UpcomingTasksCard } from "../../components/Dashboard_Cards/TaskCard";
import type { UpcomingTask } from "../../api/dashboard";
import type { GoalProgress, RecentActivity } from "../../api/dashboard";
import { RecentActivityCard } from "../../components/Dashboard_Cards/RecentActivity";
import { GoalsCard } from "../../components/Dashboard_Cards/GoalsCard";
import './Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quickActions, setQuickActions] = useState<FeatureName[]>([]);
  const [UpcomingTask, setUpcomingTask] = useState<UpcomingTask[]>([]);
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const email = localStorage.getItem("userEmail") ?? undefined;

  useEffect(() => {
    fetchCurrentUser()
      .then(user => setUsername(user.username))
      .catch(err => console.error(err));

    fetchDashboardData()
      .then(data => {
        setStats(data.stats);
        setQuickActions(data.quickActions);
        setUpcomingTask(data.upcomingTasks);
        setGoals(data.goals);
        setRecentActivity(data.recentActivity);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar userEmail={email} />

      <main className="dashboard-content">
        <h1>Dashboard</h1>

        {username ? (
          <p>Welcome back {username}! Here's your productivity overview</p>
        ) : (
          <p>Loading...</p>
        )}

        {stats ? (
          <div className="dashboard-main-row">
            <div className="dashboard-stats-row">
              <StatsCard title="Notes Created" value={stats.notesCreated} icon={<NotebookPen size={24} />} />
              <StatsCard title="Tasks Completed" value={stats.tasksCompleted} icon={<SquareCheckBig size={24} />} />
              <StatsCard title="Study Hours" value={stats.studyHours} icon={<Timer size={24} />} />
              <StatsCard title="Pomodoro Points" value={stats.pomodoroPoints} icon={<Medal size={24} />} />
            </div>

            <div className="dashboard-actions-row">
              <QuickActionsCard Actions={quickActions} />
              <UpcomingTasksCard tasks={UpcomingTask} />
            </div>

            <div className="dashboard-goals-inline">
              <GoalsCard goals={goals} />
              <RecentActivityCard activities={recentActivity} />
            </div>
          </div>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
