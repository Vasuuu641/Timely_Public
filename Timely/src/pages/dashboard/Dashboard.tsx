
import Sidebar from "../../components/Navbar/Sidebar";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../api/user";
import { NotebookPen, Timer, SquareCheckBig, Medal} from "lucide-react";
import {StatsCard} from "../../components/Dashboard_Cards/StatsCard";
import { fetchDashboardData, type DashboardStats } from "../../api/dashboard";
import './Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const email = localStorage.getItem("userEmail") ?? undefined;
  

  useEffect(() =>{
    fetchCurrentUser()
    .then(user => setUsername(user.username))
    .catch(err => console.error(err));

    fetchDashboardData()
    .then(data => setStats(data.stats))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar userEmail={email} />

      <main className="dashboard-content">
        <h1>Dashboard</h1>
        {username ? (
          <p> Welcome back {username} ! Here's your productivity overview</p>

        ) : (
          <p>Loading...</p>
        )}

        {stats ? (
          <div className="dashboard-stats-row">
          <StatsCard
           title="Notes Created"
           value={stats.notesCreated}
           icon={<NotebookPen size={24} />}
          />

          <StatsCard
           title="Tasks Completed"
           value={stats.tasksCompleted}
           icon={<SquareCheckBig size={24} />}
          />

          <StatsCard
           title="Study Hours"
           value={stats.studyHours}
           icon={<Timer size={24} />}
          />

          <StatsCard
           title="Pomodoro Points"
           value={stats.pomodoroPoints}
           icon={<Medal size={24} />}
          />

          </div>
        ) : (
          <p>Loading dashboard...</p>
        )}

      </main>
    </div>
  );
};
export default Dashboard;