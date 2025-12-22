import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ScheduleEntryService } from './schedule-entry.service';
import { CreateScheduleEntryDto } from './dto/create-scheduleentry.dto';
import { UpdateScheduleEntryDto } from './dto/update-scheduleentry.dto';
import { CurrentUser } from 'src/authentication/current-user.decorator';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class ScheduleEntryController {
  constructor(private readonly scheduleEntryService: ScheduleEntryService) {}

  // CREATE
  @Post()
  async create(
    @Body() dto: CreateScheduleEntryDto,
    @CurrentUser() user: UserWithoutPassword
  ) {
    return await this.scheduleEntryService.createScheduleEntry(dto, user.id);
  }

  // GET all schedules for the user
  @Get()
  async findAll(@CurrentUser() user: UserWithoutPassword) {
    return await this.scheduleEntryService.findAllForUser(user.id);
  }

  // GET single schedule by ID
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserWithoutPassword
  ) {
    return await this.scheduleEntryService.findScheduleById(id, user.id);
  }

  // UPDATE
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleEntryDto,
    @CurrentUser() user: UserWithoutPassword
  ) {
    return await this.scheduleEntryService.updateSchedule(id, dto, user.id);
  }

  // DELETE
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: UserWithoutPassword
  ) {
    return await this.scheduleEntryService.removeSchedule(id, user.id);
  }
}
