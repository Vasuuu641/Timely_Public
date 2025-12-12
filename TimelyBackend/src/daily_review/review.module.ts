import { Module } from '@nestjs/common';
import { DailyReviewController } from './review.controller';
import { DailyReviewService } from './review.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DailyReviewController],
  providers: [DailyReviewService],
})
export class DailyReviewModule {}