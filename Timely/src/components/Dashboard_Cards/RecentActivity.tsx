import type { RecentActivity } from "../../api/dashboard";
import "./RecentActivity.css";
import { getActivityIcon } from "../Dashboard_Cards/ActivityIcons";
import { TrendingUp } from "lucide-react";

type Props = {
  activities: RecentActivity[];
};

const formatTimeAgo = (dateString: string | Date) => {
  const now = new Date();
  const createdAt = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};


export const RecentActivityCard: React.FC<Props> = ({ activities }) => {
  return (
        <div className="recent-activity-card">
        <div className="recent-header">
            <div className="recent-logo">
            <TrendingUp size={20} />
            </div>
            <h2 className="recent-title">Recent Activity</h2>
        </div>

        <div className="recent-list">
            {activities.slice(0, 4).map((activity) => (
            <div className="recent-item" key={activity.id}>
                <div className="recent-icon">
                {getActivityIcon(activity.type)}
                </div>

                <div className="recent-body">
                <div className="recent-description">{activity.title}</div>
                <div className="recent-time">{formatTimeAgo(activity.createdAt)}</div>
                </div>
            </div>
            ))}
        </div>
        </div>
  );
};
