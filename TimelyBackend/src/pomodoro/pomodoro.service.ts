import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto';
import { EndBreakDto } from './dto/end-break.dto';
import { StartBreakDto } from './dto/start-break.dto';
import { EndPomodoroSessionDto } from './dto/end-pomodoro-session.dto';
import { PomodoroSession } from 'generated/prisma';


@Injectable()
export class PomodoroService {

    constructor (private prisma : PrismaService) {}

    async createSession(dto : CreatePomodoroSessionDto, userId : string) : Promise<PomodoroSession>
    {
        const{level} = dto;

        return this.prisma.pomodoroSession.create({
            data : {
                level,
                focusStart : new Date(),
                isCompleted : false,
                pointsEarned : 0,

                user : {
                    connect : {id : userId},
                },
            },
        });
    }

    async startBreak(dto : StartBreakDto, userId : string) 
    {
        const {sessionId} = dto;
        const existingSession = await this.prisma.pomodoroSession.findUnique({
            where : {
                id : sessionId
            },
        });

        if(!existingSession || existingSession.userId !== userId)
        {
            throw new NotFoundException('Session not found or access denied!');
        }


        const existingBreak = await this.prisma.break.findFirst({
            where : {
                sessionId : sessionId,
                endTime : null,
            },
        });

        if(existingBreak)
        {
            throw new BadRequestException('An ongoing break already exists for this session!');
        }

        const newBreak = await this.prisma.break.create({

            data : {
                 startTime : new Date(),

                 session : 
                 {
                    connect : {id : sessionId}
                 }
            },  
        });

        return {
                message: 'Break started successfully',
                break: newBreak,
               };
    }

    async endBreak(dto : EndBreakDto, userId : string)
    {
        const {breakId, endTime} = dto;
        const existingBreak = await this.prisma.break.findUnique({
            where : {
                id : breakId, 
            },

             include: {
                 session: true,
             },
        });

        if(!existingBreak)
        {
            throw new NotFoundException('Break not found');
        }

        if(existingBreak.session.userId !== userId)
        {
            throw new BadRequestException('Access Denied!');
        }

        if(existingBreak.endTime)
        {
            throw new BadRequestException('Break already ended!');

        } 

       const updatedBreak = await this.prisma.break.update({
        where: { id: breakId },
        data: {
            endTime: endTime ? new Date(endTime) : new Date(),
        },
    });

    return {
        message: 'Break ended successfully',
        break: updatedBreak,
    };
    }

   async endPomodoroSession(dto: EndPomodoroSessionDto, userId: string) {
  const { sessionId, focusEnd } = dto;

  // Fetch session and verify ownership
  const session = await this.prisma.pomodoroSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) {
    throw new NotFoundException('Session not found or access denied!');
  }

  if (session.isCompleted) {
    throw new BadRequestException('Session is already completed!');
  }

  const actualFocusEnd = focusEnd ? new Date(focusEnd) : new Date();
  const focusStart = session.focusStart;

  // Level constraints
  const levelConstraints = {
    EASY: { requiredFocusMinutes: 15, maxBreaks: Infinity, maxBreakDuration: Infinity, maxTotalBreakMinutes: Infinity },
    MEDIUM: { requiredFocusMinutes: 25, maxBreaks: 4, maxBreakDuration: 5, maxTotalBreakMinutes: 20 },
    HARD: { requiredFocusMinutes: 60, maxBreaks: 2, maxBreakDuration: 20, maxTotalBreakMinutes: 40 },
  };

  const constraints = levelConstraints[session.level];
  if (!constraints) throw new BadRequestException('Invalid session level!');

  // Fetch all breaks
  const breaks = await this.prisma.break.findMany({
    where: { sessionId },
  });

  // Auto-end ongoing breaks
  for (const b of breaks) {
    if (!b.endTime) {
      await this.prisma.break.update({
        where: { id: b.id },
        data: { endTime: actualFocusEnd },
      });
      b.endTime = actualFocusEnd;
    }
  }

  // Calculate total break time and check violations
  let totalBreakMinutes = 0;
  const warnings: string[] = [];

  for (const b of breaks) {
    if (!b.endTime) continue;
    const duration = (b.endTime.getTime() - b.startTime.getTime()) / 60000;
    totalBreakMinutes += duration;

    if (duration > constraints.maxBreakDuration) warnings.push(`Break ${b.id} exceeded max duration`);
  }

  if (breaks.length > constraints.maxBreaks) warnings.push('Too many breaks taken');
  if (totalBreakMinutes > constraints.maxTotalBreakMinutes) warnings.push('Total break time exceeded');

  // Calculate effective focus
  const effectiveFocusMinutes = (actualFocusEnd.getTime() - focusStart.getTime()) / 60000 - totalBreakMinutes;

  // Tiered compliance
  const complianceTiers = [
    { name: 'FULL', multiplier: 1, minFraction: 1 },
    { name: 'PARTIAL', multiplier: 0.5, minFraction: 0.8 },
    { name: 'MINIMUM', multiplier: 0.25, minFraction: 0.5 },
    { name: 'FAIL', multiplier: 0, minFraction: 0 },
  ];

  const focusFraction = effectiveFocusMinutes / constraints.requiredFocusMinutes;
  const tier = complianceTiers.find(t => focusFraction >= t.minFraction) || complianceTiers[complianceTiers.length - 1];

  const basePoints = { EASY: 10, MEDIUM: 25, HARD: 50 };
  const earnedPoints = (basePoints[session.level] || 0) * tier.multiplier;

  // Update session
  const updatedSession = await this.prisma.pomodoroSession.update({
    where: { id: sessionId },
    data: {
      focusEnd: actualFocusEnd,
      isCompleted: true,
      pointsEarned: earnedPoints,
    },
  });

  const durationInMinutes = Math.floor((actualFocusEnd.getTime() - focusStart.getTime()) / 60000);

  return {
    message: 'Pomodoro session ended',
    session: updatedSession,
    duration: `${durationInMinutes} minutes`,
    points: earnedPoints,
    complianceTier: tier.name,
    warnings,
  };
}

async getTodayStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get all completed sessions for today
  const sessionsToday = await this.prisma.pomodoroSession.findMany({
    where: {
      userId,
      isCompleted: true,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const pointsToday = sessionsToday.reduce((sum, session) => sum + session.pointsEarned, 0);
  const sessionsCount = sessionsToday.length;

  return {
    pointsToday,
    sessionsCompleted: sessionsCount,
  };
}
}