import React from "react";
import { DashboardCard } from "./DashboardCard";
import { useNavigate } from "react-router-dom";
import Button from '../../components/Button/Button';
import {NotebookPen, SquareCheckBig, Calendar, TimerReset, Brain, Goal} from "lucide-react";
import './ActionsCard.css';

type FeatureName = "NOTES" | "TODO" | "POMODORO" | "SCHEDULE" | "QUIZ" | "GOALS";

interface ActionsCardProps {
  Actions: FeatureName[];
};

const featureRouteMap: Record<FeatureName, string> = {
  NOTES: '/note',
  TODO: '/todo',
  POMODORO: '/pomodoro',
  SCHEDULE: '/schedule',
  QUIZ: '/quiz',
  GOALS: '/goal',
};

const featureLabelMap: Record<FeatureName, string> = {
  NOTES: 'Notes',
  TODO: 'To-Do List',
  POMODORO: 'Pomodoro Timer',
  SCHEDULE: 'Schedule',
  QUIZ: 'Quiz',
  GOALS: 'Goals',
};

const featureDescriptionMap: Record<FeatureName, string> = {
  NOTES : 'Write and organize your notes', 
  TODO: 'Manage your tasks',
  POMODORO: 'Start a focus session',
  SCHEDULE: 'Plan your weeks',
  QUIZ: 'Test yourself',
  GOALS: 'Set what you want to accomplish',
}

const featureIconMap: Record<FeatureName, React.ReactNode> = {
  NOTES : < NotebookPen />, 
  TODO: < SquareCheckBig />,
  POMODORO: < TimerReset />,
  SCHEDULE: < Calendar />,
  QUIZ: < Brain />,
  GOALS: < Goal />,
}

export const QuickActionsCard: React.FC<ActionsCardProps> = ({ Actions }) => {
  const navigate = useNavigate();

  return (
    <DashboardCard size="large" className="actions-card">
     <div className = "actions-body">
      <div className="actions-header">
        <h3>Quick Actions</h3>
        <p>Jump into your favourite features</p>
      </div>

       <div className="actions-buttons">
        {Actions.map(feature => (
          <Button
            key={feature}
            icon = {featureIconMap[feature]}
            text={featureLabelMap[feature]}
            description={featureDescriptionMap[feature]}
            variant="quick-action"
            onClick={() => navigate(featureRouteMap[feature])}
          />
        ))}
      </div>
      </div>
    </DashboardCard>
  );
};