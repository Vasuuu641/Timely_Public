import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleEntry, Prisma } from '../../generated/prisma';
import { CreateScheduleEntryDto } from './dto/create-scheduleentry.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { title } from 'process';

const scheduleSelect = {
  title:  true,
  description: true ,
  topic: true,
  isDailyPlan:true
}

@Injectable()
export class ScheduleEntryService {
    constructor(private prismaService: PrismaService){}

    async createScheduleEntry(data: Prisma.ScheduleEntryCreateInput){
        return this.prismaService.scheduleEntry.create({data});
    }

    async findScheduleById(id: string){
        return this.prismaService.scheduleEntry.findUnique({
            where: {id},
        })
    }

    async findAll(){
        return this.prismaService.scheduleEntry.findMany();
    }

    async updateSchedule(id: string, data: Prisma.ScheduleEntryUpdateInput){
        const schedule = this.findScheduleById(id);
        return this.prismaService.scheduleEntry.update({
            where: {id},
            data: data 
        })
    }

    async removeSchedule(id: string){
        try {
            return this.prismaService.scheduleEntry.delete({
                where: {id},
                select: scheduleSelect
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User with ID ${id} does not exist`);
            }
            throw error
            }
    }
}
