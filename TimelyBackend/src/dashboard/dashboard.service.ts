import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DashboardResponseDto } from "./dto/dashboard-response.dto";
import { DashboardStatsDto } from "./dto/dashboard-stats.dto";
import { RecentActivityDto } from "./dto/recent-activity.dto";
import { ActivityType } from "./enums/activity-type.enum";
import { StudyGoalResponseDto } from "src/studyGoal/dto/study-goal-response.dto";
import { GoalType } from "src/studyGoal/enums/goal-type.enum";
import { GoalProgressHelper } from "./helpers/completeGoalProgess";
import { FeatureUsageService, FeatureName } from "src/feature-usage/featureUsage.service";

@Injectable()
export class DashboardService {
    constructor(private prisma:PrismaService, private goalProgressHelper: GoalProgressHelper, private featureUsageService : FeatureUsageService){}

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

     const tasksWithDueDate = await this.prisma.todo.findMany({
     where: { userId, isCompleted: false, dueDate: { not: null } },
     orderBy: { dueDate: "asc" },
     take: 4,
     });

    const tasksWithoutDueDate = await this.prisma.todo.findMany({
      where: { userId, isCompleted: false, dueDate: null },
      orderBy: { createdAt: "asc" },
      take: 4,
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

      const goals = await this.prisma.studyGoal.findMany({
  where: { userId },
});

const goalsWithProgress = await Promise.all(
  goals.map(goal => {
    const goalDto: StudyGoalResponseDto = {
      id: goal.id,
      type: goal.type as GoalType,
      target: goal.target,
      notes: goal.notes, // include notes
      progress: 0, // temporary, helper will compute actual
      startDate: goal.startDate,
      endDate: goal.endDate,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };
    return this.goalProgressHelper.computeGoalProgress(goalDto, userId);
  })
);

const topFeatures = await this.featureUsageService.getTopFeatures(userId, 4);

const fallbackFeatures: FeatureName[] = [
  FeatureName.NOTES,
  FeatureName.TODO,
  FeatureName.POMODORO,
  FeatureName.GOALS,
];

const quickActions: FeatureName[]=
  topFeatures.length > 0
    ? topFeatures.map(f => f.feature as FeatureName)
    : fallbackFeatures;

    // 4️⃣ Return full dashboard
    return {
      stats,
      upcomingTasks: [...tasksWithDueDate, ...tasksWithoutDueDate].slice(0,5).map(task => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
      })),
      recentActivity,
      goals: goalsWithProgress,
      quickActions: quickActions,
    };
  }
}