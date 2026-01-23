
import { GoalProgressDto } from '../dto/goal-progress.dto';
import { GoalType } from 'src/studyGoal/enums/goal-type.enum';
import { StudyGoalResponseDto } from 'src/studyGoal/dto/study-goal-response.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from '@nestjs/common';


@Injectable()
export class GoalProgressHelper {
  constructor(private prisma: PrismaService) {}

 async computeGoalProgress(goal: StudyGoalResponseDto, userId: string): Promise<GoalProgressDto> {
  const startDate = new Date(goal.startDate);
  const endDate = new Date(goal.endDate);

  let current = 0;

  switch (goal.type) {
    case GoalType.TASK:
      current = await this.prisma.todo.count({
        where: {
          userId,
          isCompleted: true,
          updatedAt: { gte: startDate, lte: endDate },
        },
      });
      break;

    case GoalType.NOTE:
      current = await this.prisma.note.count({
        where: {
          userId,
          createdAt: { gte: startDate, lte: endDate },
        },
      });
      break;

    case GoalType.POMODORO:
      current = await this.prisma.pomodoroSession.count({
        where: {
          userId,
          isCompleted: true,
          focusEnd: { gte: startDate, lte: endDate },
        },
      });
      break;

    case GoalType.STUDY_HOURS: {
      const sessions = await this.prisma.pomodoroSession.findMany({
        where: {
          userId,
          isCompleted: true,
          focusStart: { gte: startDate, lte: endDate },
        },
        select: { focusStart: true, focusEnd: true },
      });

      const totalMinutes = sessions.reduce((sum, s) => {
        if (!s.focusEnd) return sum;
        return sum + (s.focusEnd.getTime() - s.focusStart.getTime()) / 60000;
      }, 0);

      current = Math.floor(totalMinutes / 60);
      break;
    }

    default:
      throw new Error(`Unhandled goal type: ${goal.type}`);
  }

  const cappedCurrent = Math.min(current, goal.target);

  const progressPercent = goal.target
    ? Math.min(Math.round((cappedCurrent / goal.target) * 100), 100)
    : 0;

  return {
    id: goal.id,
    type: goal.type,
    target: goal.target,
    current: cappedCurrent,
    progressPercent,
    notes: goal.notes,
    startDate: goal.startDate,
    endDate: goal.endDate,
  };
}
}

