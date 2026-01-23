import React from "react";
import { getDueLabel } from "../../utils/GetDueLabel";
import "./DueLabel.css";

interface DueLabelProps {
  dueDate: Date;
}

export const DueLabel: React.FC<DueLabelProps> = ({ dueDate }) => {
  const label = getDueLabel(dueDate);

  let className = "due-label";

  if (label === "Overdue") {
    className += " due-label--overdue";
  } else if (label === "Today") {
    className += " due-label--today";
  } else if (!dueDate){
    className += " due-label--no-date";
  }

  return <span className={className}>{label}</span>;
};
