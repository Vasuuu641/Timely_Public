import { Controller, Body, Post, Req } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { EndPomodoroSessionDto } from './dto/end-pomodoro-session.dto';
import { StartBreakDto } from './dto/start-break.dto';
import { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto';
import { EndBreakDto } from './dto/end-break.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CurrentUser } from 'src/authentication/current-user.decorator';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';
import { FeatureUsageService, FeatureName } from 'src/feature-usage/featureUsage.service';

@UseGuards(JwtAuthGuard)
@Controller('pomodoro')
export class PomodoroController {

    constructor(private readonly pomodoroService : PomodoroService, private readonly featureUsageService : FeatureUsageService) {}

    @Post('start')
    async createSession(@Body() dto : CreatePomodoroSessionDto, @CurrentUser() user : UserWithoutPassword)
    {
        await this.featureUsageService.trackUsage(
            user.id, 
            FeatureName.POMODORO,
        )
        
        return this.pomodoroService.createSession(dto, user.id);
    }

    @Post('start-break')
    async startBreak(@Body() dto : StartBreakDto, @CurrentUser() user : UserWithoutPassword)
    {
        return this.pomodoroService.startBreak(dto, user.id);
    }

    @Post('end-break')
    async endBreak(@Body() dto : EndBreakDto, @CurrentUser() user : UserWithoutPassword)
    {
        return this.pomodoroService.endBreak(dto, user.id);
    }

    @Post('end')
    async endSession(@Body() dto : EndPomodoroSessionDto, @CurrentUser() user : UserWithoutPassword)
    {
        return this.pomodoroService.endPomodoroSession(dto, user.id);
    }

}
