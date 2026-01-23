export function getDueLabel(dueDate?: Date | null): string {
  if (!dueDate) return "No due date";

  // Normalize both dates to midnight to avoid time-of-day bugs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays > 1) return `Due in ${diffDays} days`;

  const overdueDays = Math.abs(diffDays);
  return overdueDays === 1
    ? "Overdue by 1 day"
    : `Overdue by ${overdueDays} days`;
}
