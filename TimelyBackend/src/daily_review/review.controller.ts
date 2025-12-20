import { Controller, Get, Post, Body, Param, Query, Patch, Delete, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { DailyReviewService } from "./review.service";
import { CreateDailyReviewDto, UpdateDailyReviewDto } from "./dto/review.dto";
import { JwtAuthGuard } from "src/authentication/jwt-auth.guard";
import { CurrentUser } from "src/authentication/current-user.decorator";
import { UserWithoutPassword } from "src/user/type/user-without-password.type";

@UseGuards(JwtAuthGuard)
@Controller('review')
export class DailyReviewController
{

constructor(private readonly dailyReviewService : DailyReviewService) {}

@Post()
async create(@Body() dto : CreateDailyReviewDto, @CurrentUser() user : UserWithoutPassword)
{
    return this.dailyReviewService.create(dto, user.id);
}

@Get('today')
  async getToday(@CurrentUser() user : UserWithoutPassword)
{
  const review = await this.dailyReviewService.getTodayReview(user.id);

  if(!review)
  {
    return {message : "No review found for today."};
  }
  return review;
}


@Get('history')
getHistory(@CurrentUser() user : UserWithoutPassword, @Query("skip") skip?: string, @Query("take") take? : string)
{
    return this.dailyReviewService.getReviewHistory(
      user.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 10
    );
  }

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateDailyReviewDto, @CurrentUser() user: UserWithoutPassword)
{

  return this.dailyReviewService.updateReview(+id, user.id, dto);

}

@Delete(':id')
deleteReview(@Param('id') id : string, @CurrentUser() user : UserWithoutPassword)
{
  return this.dailyReviewService.deleteReview(+id, user.id);
}
}