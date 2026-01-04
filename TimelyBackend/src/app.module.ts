import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ToDoModule } from './todo/todo.module';
import { DailyReviewModule } from './daily_review/review.module'
import { UserModule } from './user/user.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { ScheduleEntryModule } from './schedule-entry/schedule-entry.module';
import { NoteModule } from './note/note.module';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './authentication/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StudyGoalModule } from './studyGoal/studyGoal.module';

@Module({
  imports: [UserModule,DailyReviewModule,ToDoModule, PomodoroModule, PrismaModule, ScheduleEntryModule, NoteModule, QuizModule, AuthModule, DashboardModule, StudyGoalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
