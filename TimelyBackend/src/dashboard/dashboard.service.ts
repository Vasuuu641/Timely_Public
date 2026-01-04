import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DashboardResponseDto } from "./dto/dashboard-response.dto";
import { DashboardStatsDto } from "./dto/dashboard-stats.dto";
import { UpcomingTaskDto } from "./dto/upcoming-tasks.dto";
import { RecentActivityDto } from "./dto/recent-activity.dto";
import { ActivityType } from "./enums/activity-type.enum";

@Injectable()
export class DashboardService {
    constructor(private prisma:PrismaService){}

    async getDashboardData(userId:string):Promise<DashboardResponseDto>{
        const [notesCreated, tasksCompleted, studyHours, pomodoroPoints] = await Promise.all([
            this.prisma.note.count({where:{userId}}),
            this.prisma.todo.count({where:{userId,isCompleted:true}}),
            this.prisma.pomodoroSession.count({where:{userId, isCompleted:true}}),
            this.prisma.pomodoroSession.aggregate({
                _sum:{pointsEarned:true},
                where:{userId}, 
            }).then(res => res._sum.pointsEarned ?? 0)
        ]);

        const stats:DashboardStatsDto = {
            notesCreated,
            tasksCompleted,
            studyHours,
            pomodoroPoints
        };

        const upcomingTasks: UpcomingTaskDto[] = await this.prisma.todo.findMany({
            where:{userId, isCompleted:false},
            orderBy:{createdAt:'asc'},
            take:5,
            select:{id:true, title:true, createdAt:true}
        });

      const recentNotes = this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { title: true, createdAt: true },
    });

    const recentTasks = this.prisma.todo.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { title: true, updatedAt: true },
    });

    const recentPomodoros = this.prisma.pomodoroSession.findMany({
      where: { userId, isCompleted: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { pointsEarned: true, updatedAt: true },
    });

    const recentQuizzes = this.prisma.quiz.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentReviews = this.prisma.dailyReview.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });

    const recentSchedules = this.prisma.scheduleEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const [notes, tasks, pomodoros, reviews, schedules, quizzes] = await Promise.all([
      recentNotes,
      recentTasks,
      recentPomodoros,
      recentReviews,
      recentSchedules,
      recentQuizzes
    ]);

     const recentActivity: RecentActivityDto[] = [
      ...notes.map(n => ({ 
        type: ActivityType.NOTE, 
        title: n.title ?? 'Untitled note', 
        createdAt: n.createdAt })),

      ...tasks.map(t => ({ 
        type: ActivityType.TASK, 
        title: t.title, 
        createdAt: t.updatedAt })),

      ...pomodoros.map(p => ({ 
        type: ActivityType.POMODORO, 
        title: `${p.pointsEarned} points`, 
        createdAt: p.updatedAt })),

      ...reviews.map(r => ({ 
        type: ActivityType.REVIEW, 
        title: `Review for ${r.date.toDateString()}`, 
        createdAt: r.date })),
        
      ...schedules.map(s => ({ 
        type: ActivityType.SCHEDULE, 
        title: s.title, 
        createdAt: s.createdAt })),

      ...quizzes.map(q => ({ 
        type: ActivityType.QUIZ, 
        title: q.topic, 
        createdAt: q.createdAt })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    // 4️⃣ Return full dashboard
    return {
      stats,
      upcomingTasks,
      recentActivity,
    };
    }
  }