import React from "react";
import { DashboardCard } from "./DashboardCard";
import { UpcomingTaskItem } from "./TaskItem";
import type { UpcomingTask } from "../../api/dashboard";
import "./TaskCard.css";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";


interface TasksCardProps {
  tasks: UpcomingTask[];
}

export const UpcomingTasksCard: React.FC<TasksCardProps> = ({ tasks }) => {
  const navigate = useNavigate();
  return (
    <DashboardCard size="medium" className="upcoming-tasks-card">
      <div className="upcoming-tasks-header">
        <h3>Upcoming Tasks</h3>
        <p>Your Priorities</p>
      </div>

      <div className="upcoming-tasks-body">
        {tasks.length === 0 ? (
          <p className="upcoming-tasks-empty">No upcoming tasks</p>
        ) : (
          tasks.map(task => (
            <UpcomingTaskItem key={task.id} task={task} />
          ))
        )}
      </div>

      <div className="upcoming-tasks-footer">
        <Button
          text="View all tasks"
          variant="view-all-tasks"
          onClick={() => navigate("/todo")}
        />
      </div>
    </DashboardCard>
  );
};