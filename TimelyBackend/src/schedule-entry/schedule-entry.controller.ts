import { Body, Controller, Delete, Get, Param, Patch, Post, Req} from '@nestjs/common';
import { ScheduleEntryService } from './schedule-entry.service';
import { CreateScheduleEntryDto } from './dto/create-scheduleentry.dto';
import { Prisma } from 'generated/prisma';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class ScheduleEntryController {
  constructor(private scheduleEntryService: ScheduleEntryService) {}

  private getUserId(req: any): string {
      return req.headers['x-user-id'] || 'test-user-123';
  }

  //create entry
  @Post()
  async create(@Body() createScheduleEntryDto: Prisma.ScheduleEntryCreateInput, @Req() req:any){
    const userId = this.getUserId(req)
    const userInput = {
      ...createScheduleEntryDto,
      startTime: new Date(createScheduleEntryDto.startTime),
      endTime: createScheduleEntryDto.endTime ? new Date(createScheduleEntryDto.endTime) : undefined,
      user: { // <<< THIS IS WHERE THE 'user' RELATION MUST BE DEFINED
        connect: { id: userId }, // Connect to an existing User record using their ID
      },
    };

    return this.scheduleEntryService.createScheduleEntry(userInput);
  }

  //get all schedule entries for particular user
  @Get(':id')
  async getSchedule(@Param('id') id: string){
    return this.scheduleEntryService.findScheduleById(id);
  }
  //get specific schedule entry
  //update schedule entry
  @Patch(':id')
  async updateSchedule(@Param('id') id: string, @Body() data: Prisma.ScheduleEntryUpdateInput){
    return this.scheduleEntryService.updateSchedule(id, data)
  }

  //remove schedule entry
  @Delete(':id')
  async removeSchedule(@Param('id') id: string){
    return this.scheduleEntryService.removeSchedule(id)
  }
}