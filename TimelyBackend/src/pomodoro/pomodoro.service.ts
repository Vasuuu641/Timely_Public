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
                id : sessionId, 
                userId : userId
            },
        });

        if(!existingSession || !existingSession.userId)
        {
            throw new NotFoundException('Session not found or access denied!');
        }


        const existingBreak = await this.prisma.break.findFirst({
            where : {
                sessionId : sessionId,
            },
        });

        if(existingBreak)
        {
            throw new BadRequestException('Break already exists for this session!');
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

        if(!existingBreak.session.userId || !userId)
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

  const existingSession = await this.prisma.pomodoroSession.findUnique({
    where: { id: sessionId, userId },
  });

  if (!existingSession || !existingSession.userId) {
    throw new NotFoundException('Session not found or access denied!');
  }

  if (existingSession.isCompleted) {
    throw new BadRequestException('Session is already completed!');
  }

  const actualFocusEnd = focusEnd ? new Date(focusEnd) : new Date();
  const focusStart = existingSession.focusStart;

  // Level constraints config
  const levelConstraints = {
    EASY: {
      requiredFocusMinutes: 30,
      maxBreaks: Infinity,
      maxBreakDuration: Infinity,
      maxTotalBreakMinutes: Infinity,
      requiredFocusStartMinutes: 5,
      requiredFocusEndMinutes: 5,
    },
    MEDIUM: {
      requiredFocusMinutes: 60,
      maxBreaks: 4,
      maxBreakDuration: 5,
      maxTotalBreakMinutes: 20,
      requiredFocusStartMinutes: 10,
      requiredFocusEndMinutes: 10,
    },
    HARD: {
      requiredFocusMinutes: 120,
      maxBreaks: 2,
      maxBreakDuration: 20,
      maxTotalBreakMinutes: 40,
      requiredFocusStartMinutes: 15,
      requiredFocusEndMinutes: 15,
    },
  };

  const constraints = levelConstraints[existingSession.level];
  if (!constraints) {
    throw new BadRequestException('Invalid session level!');
  }

  // Fetch all breaks of this session
  const breaks = await this.prisma.break.findMany({
    where: { sessionId },
  });

  // Validate breaks: count, duration, and calculate total break time
  let totalBreakMinutes = 0;

  for (const b of breaks) {
    if (!b.endTime) {
      throw new BadRequestException('All breaks must be ended before ending session.');
    }
    const breakDuration = (b.endTime.getTime() - b.startTime.getTime()) / 60000; // minutes

    if (breakDuration > constraints.maxBreakDuration) {
      throw new BadRequestException(
        `Break longer than allowed max length for ${existingSession.level} level.`,
      );
    }
    totalBreakMinutes += breakDuration;
  }

  if (breaks.length > constraints.maxBreaks) {
    throw new BadRequestException(
      `Too many breaks for ${existingSession.level} level.`,
    );
  }

  if (totalBreakMinutes > constraints.maxTotalBreakMinutes) {
    throw new BadRequestException(
      `Total break time exceeds limit for ${existingSession.level} level.`,
    );
  }

  // Validate required focus periods (no breaks allowed in these windows)
  const requiredFocusStartEnd = focusStart.getTime() + constraints.requiredFocusStartMinutes * 60000;
  const requiredFocusEndStart = actualFocusEnd.getTime() - constraints.requiredFocusEndMinutes * 60000;

  for (const b of breaks) {
    if (!b.endTime) {
    throw new BadRequestException('All breaks must be ended before ending session.');
    }
    if (
      b.startTime.getTime() < requiredFocusStartEnd &&
      b.endTime.getTime() > focusStart.getTime()
    ) {
      throw new BadRequestException(
        `Break during required focus period at start for ${existingSession.level} level.`,
      );
    }
    if (
      b.startTime.getTime() < actualFocusEnd.getTime() &&
      b.endTime.getTime() > requiredFocusEndStart
    ) {
      throw new BadRequestException(
        `Break during required focus period at end for ${existingSession.level} level.`,
      );
    }
  }

  // Calculate effective focus time
  const effectiveFocusMinutes =
    (actualFocusEnd.getTime() - focusStart.getTime()) / 60000 - totalBreakMinutes;

  if (effectiveFocusMinutes < constraints.requiredFocusMinutes) {
    throw new BadRequestException(
      `Effective focus time is less than required for ${existingSession.level} level.`,
    );
  }

  // Award points if all validations pass
  const basePoints = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  };

  const earnedPoints = basePoints[existingSession.level] || 0;

  // Update session as completed
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
    message: 'Pomodoro session ended successfully',
    session: updatedSession,
    duration: `${durationInMinutes} minutes`,
    points: earnedPoints,
  };
}
}
