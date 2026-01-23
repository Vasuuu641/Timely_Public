import type { GoalProgress } from "../../api/dashboard";
import "./GoalItem.css";

type GoalItemProps = {
  goal: GoalProgress;
};

export const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  return (
    <div className="goal-item">
      <div className="goal-item-title">
        {goal.notes ?? goal.type}
      </div>

      <div className="goal-item-progress">
        <div className="goal-progress-bar">
          <div
            className="goal-progress-fill"
            style={{ width: `${goal.progressPercent}%` }}
          />
        </div>

        <div className="goal-item-count">
          {goal.current}/{goal.target}
        </div>
      </div>
    </div>
  );
};
