import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { StudyGoalService } from './studyGoal.service'
import { CreateGoalDto } from './dto/create-study-goal.dto';
import { UpdateGoalDto } from './dto/update-study-goal.dto';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CurrentUser } from 'src/authentication/current-user.decorator';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';
import { FeatureUsageService, FeatureName } from 'src/feature-usage/featureUsage.service';

@Controller('study-goals')
@UseGuards(JwtAuthGuard) // Protect all routes with JWT auth
export class StudyGoalController {
  constructor(private readonly studyGoalService: StudyGoalService, private readonly featureUsageService : FeatureUsageService) {}

  // Create a goal
  @Post()
  async create(
  @Body() dto: CreateGoalDto, @CurrentUser() user: UserWithoutPassword) {
    const userId = user.id;
    return this.studyGoalService.createStudyGoal(user.id, dto);
  }

  // Get all goals for the current user
  @Get()
  async findAll(@CurrentUser() user: UserWithoutPassword) {
    await this.featureUsageService.trackUsage(
      user.id, 
      FeatureName.GOALS,
    )
    return this.studyGoalService.getStudyGoals(user.id);
  }

  // Get single goal by ID
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: UserWithoutPassword) {
    const userId = user.id;
    return this.studyGoalService.getStudyGoalById(id, userId);
  }

  // Update a goal
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGoalDto, @CurrentUser() user: UserWithoutPassword) {
    const userId = user.id;
    return this.studyGoalService.updateStudyGoal(user.id, id, dto);
  }

  // Delete a goal
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserWithoutPassword) {
    const userId = user.id;
    return this.studyGoalService.deleteStudyGoal(userId, id);
  }
}
