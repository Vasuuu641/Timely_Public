
import { GoalProgressDto } from '../dto/goal-progress.dto';
import { GoalType } from 'src/studyGoal/enums/goal-type.enum';
import { StudyGoalResponseDto } from 'src/studyGoal/dto/study-goal-response.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from '@nestjs/common';


@Injectable()
export class GoalProgressHelper {
  constructor(private prisma: PrismaService) {}

  async computeGoalProgress(goal : StudyGoalResponseDto, userId: string): Promise<GoalProgressDto> {
    let current = 0;

    switch (goal.type) {
      case GoalType.TASK:
        current = await this.prisma.todo.count({
          where: {
            userId,
            isCompleted: true,
            updatedAt: {
              gte: goal.startDate,
              lte: goal.endDate,
            },
          },
        });
        break;

      case GoalType.NOTE:
        current = await this.prisma.note.count({
          where: {
            userId,
            createdAt: {
              gte: goal.startDate,
              lte: goal.endDate,
            },
          },
        });
        break;

      case GoalType.POMODORO:
        current =
          (
            await this.prisma.pomodoroSession.aggregate({
              _sum: { pointsEarned: true },
              where: {
                userId,
                isCompleted: true,
                updatedAt: {
                  gte: goal.startDate,
                  lte: goal.endDate,
                },
              },
            })
          )._sum.pointsEarned ?? 0;
        break;

      case GoalType.STUDY_HOURS: {
       const sessions = await this.prisma.pomodoroSession.findMany({
        where: {
        userId,
        isCompleted: true,
        focusStart: {
        gte: goal.startDate,
        lte: goal.endDate,
      },
    },
    select: {
      focusStart: true,
      focusEnd: true,
    },
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
    const progressPercent = goal.target
  ? Math.min(Math.round((current / goal.target) * 100), 100)
  : 0;


    return {
      id: goal.id,
      type: goal.type,
      target: goal.target,
      current,
      progressPercent,
      notes: goal.notes,
      startDate: goal.startDate,
      endDate: goal.endDate,
    };
  }
}

