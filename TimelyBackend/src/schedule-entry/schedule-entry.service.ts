import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleEntryDto } from './dto/create-scheduleentry.dto';
import { UpdateScheduleEntryDto } from './dto/update-scheduleentry.dto';

@Injectable()
export class ScheduleEntryService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async createScheduleEntry(dto: CreateScheduleEntryDto, userId: string) {
    const data = {
      title: dto.title,
      isDailyPlan: dto.isDailyPlan,
      startTime: new Date(dto.startTime),
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      description: dto.notes,
      isRecurring: dto.isRecurring,
      user: { connect: { id: userId } },
    };

    return await this.prisma.scheduleEntry.create({ data });
  }

  // READ single entry with ownership check
  async findScheduleById(id: string, userId: string) {
    const entry = await this.prisma.scheduleEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException(`Schedule entry with ID ${id} not found`);
    if (entry.userId !== userId) throw new ForbiddenException('You do not own this schedule entry');
    return entry;
  }

  // READ all entries for a user
  async findAllForUser(userId: string) {
    return await this.prisma.scheduleEntry.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    });
  }

  // UPDATE
  async updateSchedule(
    id: string,
    dto: UpdateScheduleEntryDto,
    userId: string
  ) {
    const entry = await this.findScheduleById(id, userId); // ownership check

    const data = {
      title: dto.title,
      isDailyPlan: dto.isDailyPlan,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      description: dto.notes,
      isRecurring: dto.isRecurring,
    };

    return await this.prisma.scheduleEntry.update({ where: { id }, data });
  }

  // DELETE
  async removeSchedule(id: string, userId: string) {
    const entry = await this.findScheduleById(id, userId); // ownership check
    return await this.prisma.scheduleEntry.delete({ where: { id: entry.id } });
  }
}
