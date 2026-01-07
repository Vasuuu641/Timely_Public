import type { ReactNode } from "react";
import { DashboardCard } from "./DashboardCard";
import './StatsCard.css';

type StatsCardProps = {
  title: string;
  value: number | string;
  icon?: ReactNode;
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
   <DashboardCard size="small" variant="stats">
      {/* Top-left heading */}
      <h4 className="stats-title">{title}</h4>

      {/* Bottom row: number + icon */}
      <div className="stats-bottom-row">
      <span className="stats-value">{value}</span>
      {icon && <div className="stats-icon">{icon}</div>}
      </div>
    </DashboardCard>
  );
};

