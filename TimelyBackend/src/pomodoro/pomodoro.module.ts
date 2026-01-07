import { Module } from '@nestjs/common';
import { PomodoroController } from './pomodoro.controller';
import { PomodoroService } from './pomodoro.service';
import { FeatureUsageModule } from 'src/feature-usage/featureUsage.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, FeatureUsageModule],
  controllers: [PomodoroController],
  providers: [PomodoroService]
})
export class PomodoroModule {}
