import { Controller, Body, Post, Req } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { EndPomodoroSessionDto } from './dto/end-pomodoro-session.dto';
import { StartBreakDto } from './dto/start-break.dto';
import { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto';
import { EndBreakDto } from './dto/end-break.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pomodoro')
export class PomodoroController {

    constructor(private readonly pomodoroService : PomodoroService) {}

    // Simulate getting user ID from request header (e.g., for testing)
    private getUserId(req: any): string {
    return req.headers['x-user-id'] || 'test-user-123'; // fallback only for dev
    }

    @Post('start')
    async createSession(@Body() dto : CreatePomodoroSessionDto, @Req() req : any)
    {
        const userId = this.getUserId(req);
        return this.pomodoroService.createSession(dto, userId);
    }

    @Post('start-break')
    async startBreak(@Body() dto : StartBreakDto, @Req() req : any)
    {
        const userId = this.getUserId(req);
        return this.pomodoroService.startBreak(dto, userId);
    }

    @Post('end-break')
    async endBreak(@Body() dto : EndBreakDto, @Req() req : any)
    {
        const userId = this.getUserId(req);
        return this.pomodoroService.endBreak(dto, userId);
    }

    @Post('end')
    async endSession(@Body() dto : EndPomodoroSessionDto, @Req() req : any)
    {
        const userId = this.getUserId(req);
        return this.pomodoroService.endPomodoroSession(dto, userId);
    }


}
