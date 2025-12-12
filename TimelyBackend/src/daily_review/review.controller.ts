import { Controller, Get, Post, Body, Param, Query, Patch, Delete, Request, UnauthorizedException } from "@nestjs/common";
import { DailyReviewService } from "./review.service";
import { CreateDailyReviewDto, UpdateDailyReviewDto } from "./dto/review.dto";


@Controller('review')
export class DailyReviewController
{

constructor(private readonly dailyReviewService : DailyReviewService) {}

// Simulate getting user ID from request header (e.g., for testing)
private getUserId(req: any): string {
  return req.headers['x-user-id'] || 'test-user-123'; // fallback only for dev
}


@Post()
async create(@Body() dto : CreateDailyReviewDto, @Request() req : any)
{
    const userId = this.getUserId(req);
    return this.dailyReviewService.create(dto, userId);
}

@Get('today')
getToday(@Request() req : any) 
{
  const userId = this.getUserId(req);

  return this.dailyReviewService.getTodayReview(userId);
}


@Get('history')
getHistory(@Request() req: any, @Query("skip") skip?: string, @Query("take") take? : string)
{
    const userId = this.getUserId(req);

    if(!userId)
    {
      throw new UnauthorizedException('User not authenticated!');
    }
    return this.dailyReviewService.getReviewHistory(
      userId,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 10
    );
  }

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateDailyReviewDto, @Request() req : any)
{

  const userId = this.getUserId(req);

  if(!userId)
  {
    throw new UnauthorizedException('User not authenticated!');
  }

  return this.dailyReviewService.updateReview(+id, userId, dto);

}

@Delete(':id')
deleteReview(@Param('id') id : string, @Request() req : any)
{
  const userId = this.getUserId(req);

  if(!userId)
  {
    throw new UnauthorizedException('User not authenticated!');
  }

  return this.dailyReviewService.deleteReview(+id, userId);
}
}