import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prismaService: PrismaService){}

  async create(createQuizDto: CreateQuizDto, userId: string) {
    return this.prismaService.quiz.create({
      data: {
        topic : createQuizDto.topic,
        description: createQuizDto.description,
        options: JSON.stringify(createQuizDto.options),
        correctAnswer: createQuizDto.correctAnswer,
        user: { connect: { id: userId } },
      },
    });
  }

  async getAll(userId: string) {
     const quizzes = await this.prismaService.quiz.findMany({
      where: { userId }, 
    });

    return quizzes.map(q => ({ ...q, options: JSON.parse(q.options) }));
  }

  async getOne(id: string, userId: string) {
    const currQuiz = await this.prismaService.quiz.findUnique({
      where: {id},
      select: {
      id: true,
      topic: true,
      description: true,
      options: true,
      correctAnswer: true,
      userId: true,  
  },
    });

    if (!currQuiz || currQuiz.userId !== userId) {
      throw new NotFoundException(`Quiz with ID ${id} not found.`);
    }

    return { ...currQuiz, options: JSON.parse(currQuiz.options) };
  }

  async update(id: string, updateQuizDto: UpdateQuizDto, userId: string) {
    const currQuiz = await this.getOne(id, userId);

    const updateData: any = { ...updateQuizDto };
    if (updateData.options) updateData.options = JSON.stringify(updateData.options);

    return this.prismaService.quiz.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    const currQuiz = await this.getOne(id, userId); // ensures access control
    return this.prismaService.quiz.delete({ where: { id: currQuiz.id } });
  }
}
