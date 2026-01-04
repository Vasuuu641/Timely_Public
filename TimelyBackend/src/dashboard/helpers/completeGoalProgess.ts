import { PrismaService } from 'src/prisma/prisma.service';
import { GoalProgressDto } from '../dto/goal-progress.dto';
import { GoalType } from 'src/studyGoal/enums/goal-type.enum';
import { StudyGoalResponseDto } from 'src/studyGoal/dto/study-goal-response.dto';


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

        case GoalType.STUDY_HOURS:
        current = await this.prisma.pomodoroSession.count({
          where: {
            userId,
            isCompleted: true,
            focusStart: {
                gte: goal.startDate,
                lte: goal.endDate,
            },
          },
        });
        break;

        default:
           throw new Error(`Unhandled goal type: ${goal.type}`);

    }

    const progressPercent = Math.min(
      Math.round((current / goal.target) * 100),
      100,
    );

    return {
      id: goal.id,
      type: goal.type,
      target: goal.target,
      current,
      progressPercent,
      startDate: goal.startDate,
      endDate: goal.endDate,
    };
  }
}
