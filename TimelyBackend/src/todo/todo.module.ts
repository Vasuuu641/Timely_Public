import { Module } from '@nestjs/common';
import { ToDoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FeatureUsageModule } from 'src/feature-usage/featureUsage.module';

@Module({
  imports : [PrismaModule, FeatureUsageModule],
  controllers: [TodoController],
  providers: [ToDoService],
})
export class ToDoModule {}
