import React from "react";
import type { UpcomingTask } from "../../api/dashboard";
import { getDueLabel } from "../../utils/GetDueLabel";
import "./TaskItem.css";


interface UpcomingTaskItemProps {
  task: UpcomingTask;
}

export const UpcomingTaskItem: React.FC<UpcomingTaskItemProps> = ({ task }) => {
  const dueLabel = getDueLabel(task.dueDate);
  const isOverdue = dueLabel === "Overdue";
  const priority = task.priority ?? "MEDIUM";

  return (
    <div
      className={`task-item ${
        isOverdue ? "task-item--overdue" : ""
      }`}
    >

      <div className="task-item-header">
        <span className="task-title" title={task.title}>
        {task.title}
      </span>
      
      <div className={`task-priority task-priority--${priority.toLowerCase()}`}>
        <span className="task-priority-text">
        {priority}
      </span>
      </div>
      </div>

      <div 
      className={`task-due ${
          isOverdue ? "task-due--overdue" : ""
        }`}
      >
        {dueLabel}
      </div> 
    </div>
  );
};
