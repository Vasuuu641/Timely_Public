import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FeatureUsageModule } from 'src/feature-usage/featureUsage.module';

@Module({
  imports: [PrismaModule, FeatureUsageModule], 
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
