import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CurrentUser } from 'src/authentication/current-user.decorator';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';

@UseGuards(JwtAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto, @CurrentUser() user: UserWithoutPassword) {
    return this.quizService.create(createQuizDto, user.id);
  }

  @Get()
  getAll(@CurrentUser() user: UserWithoutPassword) {
    return this.quizService.getAll(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: UserWithoutPassword) {
    return this.quizService.getOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto, @CurrentUser() user: UserWithoutPassword) {
    return this.quizService.update(id, updateQuizDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserWithoutPassword) {
    return this.quizService.remove(id, user.id);
  }
}
