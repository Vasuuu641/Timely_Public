import './DashboardCard.css';

type CardProps = {
  size?: 'small' | 'medium' | 'large' | 'average' | 'exaverage';
  variant?: 'stats' | 'activity' | 'actions' | 'tasks'| 'goals';
  children: React.ReactNode;  
  className?: string;         
};

export const DashboardCard: React.FC<CardProps> = ({ size = 'medium', children, className }) => {
  const sizeClass = {
    small: 'dashboard-card--small',
    medium: 'dashboard-card--medium',
    large: 'dashboard-card--large',
    average: 'dashboard-card--average',
    exaverage: 'dashboard-card--exaverage',
  }[size];

  return (
    <div className={`dashboard-card ${sizeClass} ${className}`}>
      {children}
    </div>
  );
};
