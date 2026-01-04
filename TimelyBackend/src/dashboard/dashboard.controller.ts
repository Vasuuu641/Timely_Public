import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { JwtAuthGuard } from "src/authentication/jwt-auth.guard";
import { Request } from 'express';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDashboard(@Req() req: Request): Promise<DashboardResponseDto> {
        const userId = (req.user as any).id;
        return this.dashboardService.getDashboardData(userId);
    }
}