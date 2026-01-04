import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGoalDto } from './dto/create-study-goal.dto';
import { UpdateGoalDto } from './dto/update-study-goal.dto';

@Injectable()
export class StudyGoalService {
  constructor(private prisma: PrismaService) {}

  async createStudyGoal(userId: string, createGoalDto: CreateGoalDto) {
    const { type, target, notes, startDate, endDate } = createGoalDto;
    return this.prisma.studyGoal.create({
      data: {
        user: { connect: { id: userId } },
        type: createGoalDto.type,
        target: createGoalDto.target,
        notes: createGoalDto.notes,
        startDate: new Date(createGoalDto.startDate),
        endDate: new Date(createGoalDto.endDate),
      },
    }); 
  }

  async getStudyGoals(userId: string) {
    return this.prisma.studyGoal.findMany({
      where: { userId },
    });
  }

  async getStudyGoalById(goalId: string, userId: string) {
    const goal = await this.prisma.studyGoal.findUnique({
      where: { id: goalId, userId },
    });
    if (!goal) {
      throw new NotFoundException('Study goal not found');
    }
    return goal;
  }

  async updateStudyGoal(userId: string, goalId: string, updateGoalDto: UpdateGoalDto) {
    await this.getStudyGoalById(goalId, userId); 

    const { type, target, notes, startDate, endDate } = updateGoalDto;
    return this.prisma.studyGoal.update({
      where: { id: goalId },
      data: {
        type,
        target,
        notes,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });
  }

  async deleteStudyGoal(userId: string, goalId: string) {
    await this.getStudyGoalById(goalId, userId); // Ensure goal exists

    return this.prisma.studyGoal.delete({
      where: { id: goalId },
    });
  }
}   