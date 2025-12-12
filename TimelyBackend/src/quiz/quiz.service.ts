import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prismaService: PrismaService){}

  create(createQuizDto: CreateQuizDto) {
    return this.prismaService.quiz.create({
      data: {
        topic : createQuizDto.topic,
        description: createQuizDto.description,
        options: JSON.stringify(createQuizDto.options),
        correctAnswer: createQuizDto.correctAnswer,
      },
    });
  }

  findAll() {
    return this.prismaService.quiz.findMany();
  }

  findOne(id: string) {
    const currQuiz = this.prismaService.quiz.findUnique({
      where: {id}
    });
    if(!currQuiz){
      throw new NotFoundException(`quiz with id ${id} not found.`)
    }
    return currQuiz;
  }

  update(id: string, updateQuizDto: UpdateQuizDto) {
    const currQuiz = this.findOne(id);

    //Remove userId from update data
    const {...data} = updateQuizDto;

    //Prepare a copy for Prisma Update
    const updateData: any = {...data}

    if(data.options){
      updateData.options = JSON.stringify(data.options);
    }
    return this.prismaService.quiz.update({
      where: {id},
      data: updateData
    });
  }

  remove(id: string) {
    try {
      return this.prismaService.quiz.delete({where:{id}});
    } catch (error) {
      if(error.code === "P2025"){
        throw new NotFoundException("didn't find question.")
      }
      throw error
    }
  }
}
