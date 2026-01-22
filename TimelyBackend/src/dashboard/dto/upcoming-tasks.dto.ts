export class UpcomingTaskDto {
  id: number;
  title: string;
  dueDate?: Date | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
}