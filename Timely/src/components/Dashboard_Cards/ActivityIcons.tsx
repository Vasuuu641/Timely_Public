import { Brain, Timer, CheckCircle, BookOpen, CalendarCheck, SquareCheck } from "lucide-react";
import type { ActivityType } from "../../api/dashboard";

export const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "QUIZ":
      return <Brain size={20} />;
    case "POMODORO":
      return <Timer size={20} />;
    case "TASK":
      return <SquareCheck size={20} />;
    case "NOTE":
      return <BookOpen size={20} />;
    case "SCHEDULE":
      return <CalendarCheck size={20} />;
    case "REVIEW":
      return <CheckCircle size={20} />;
    default:
      return <SquareCheck size={20} />;
  }
};
