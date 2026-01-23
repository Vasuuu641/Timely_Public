import { DashboardCard } from "./DashboardCard";
import type { GoalProgress } from "../../api/dashboard";
import { GoalItem } from "./GoalItem";
import {Target} from "lucide-react";
import "./GoalsCard.css";

type GoalsCardProps = {
  goals: GoalProgress[];
};

export const GoalsCard: React.FC<GoalsCardProps> = ({ goals }) => {
  return (
     <DashboardCard size="large" className="goals-card">
      <div className="goals-card-inner">
        <div className="goals-card-header">
            <Target />
            <h2 className="goals-card-title">Study Progress</h2>
        </div>
        <p className="goals-card-subtitle">Your weekly learning goals</p>

        <div className="goals-list">
          {goals.slice(0, 3).map(goal => (
            <GoalItem key={goal.id} goal={goal} />
            ))}
        </div>
      </div>
    </DashboardCard>
  );
};
