import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDailyReviewDto, UpdateDailyReviewDto } from "./dto/review.dto";

@Injectable()

export class DailyReviewService
{
    
    constructor(private prisma : PrismaService) {}


    async create(dto: CreateDailyReviewDto, userId : string)
     {

        const{date, reflection, rating} = dto;
        return this.prisma.dailyReview.create({
            data : {
                date: date ? new Date(date) : new Date(),
                reflection,
                rating,
                user : {
                    connect : {id : userId},
                }
            },
        });

    }

    getTodayReview(userId : string)
    {

        const today = new Date().toISOString().split('T')[0];

        return this.prisma.dailyReview.findFirst({
            where : {
                userId,
                date : {
                    gte : new Date(today + 'T00:00:00.000Z'),
                    lte : new Date(today + 'T23:59:59.999Z'),
                },
            },
        });

    }

    getReviewHistory(userId : string, skip? : number, take? : number)
    {

        return this.prisma.dailyReview.findMany({
            where : {
                userId,
            },

            orderBy : {
                date : 'desc',
            },

            skip : skip?? 0,
            take : take?? 10,


        })

    }

    async updateReview(id : number, userId : string, dto : UpdateDailyReviewDto)
    {

        const review = await this.prisma.dailyReview.findUnique({
            where : {id},
        })

        if(!review)
        {
            throw new NotFoundException('Review Not Found!');

        }

        if(review.userId !== userId)
        {
            throw new ForbiddenException('You cannot update this review!');

        }

        return this.prisma.dailyReview.update({
            where: {id}, 
            data : dto,
        });
        
    
    }

    async deleteReview(id : number, userId : string )
    {
        const review = await this.prisma.dailyReview.findUnique({
            where : {id},
        })

        if(!review)
        {
            throw new NotFoundException('Review not found!');
        }

        if(review.userId !== userId)
        {

            throw new ForbiddenException('You cannot delete this review');

        }

        return this.prisma.dailyReview.delete({
            where : {id},
        })
    }

    async getTodaySummary(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get completed todos for today
        const completedTodos = await this.prisma.todo.findMany({
            where: {
                userId,
                isCompleted: true,
                updatedAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        // Get completed pomodoro sessions for today
        const pomodoroSessions = await this.prisma.pomodoroSession.findMany({
            where: {
                userId,
                isCompleted: true,
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        // Get all todos to calculate completion percentage
        const allTodos = await this.prisma.todo.findMany({
            where: {
                userId,
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        // Calculate study goals for today
        const studyGoals = await this.prisma.studyGoal.findMany({
            where: {
                userId,
                startDate: {
                    lte: new Date(),
                },
                endDate: {
                    gte: today,
                },
            },
        });

        const completionPercentage = allTodos.length > 0 
            ? Math.round((completedTodos.length / allTodos.length) * 100)
            : 0;

        const totalPointsToday = pomodoroSessions.reduce((sum, session) => sum + session.pointsEarned, 0);

        return {
            tasksDone: completedTodos.length,
            focusSessions: pomodoroSessions.length,
            studyTime: 0, // This would need to be calculated from a separate study log or notes
            completionPercentage,
            totalPointsToday,
            studyGoals: studyGoals.map(goal => ({
                id: goal.id,
                type: goal.type,
                target: goal.target,
                notes: goal.notes,
            })),
        };
    }
}
