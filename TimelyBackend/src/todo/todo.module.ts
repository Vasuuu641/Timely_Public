import { Module } from '@nestjs/common';
import { ToDoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports : [PrismaModule],
  controllers: [TodoController],
  providers: [ToDoService],
})
export class ToDoModule {}
