import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CurrentUser } from 'src/authentication/current-user.decorator';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: UserWithoutPassword,
  ) {
    // user is included for future-proofing (per-user categories)
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@CurrentUser() user: UserWithoutPassword) {
    return this.categoryService.getAll();
    }

  @Get(':id') getById( @Param('id') id: string, @CurrentUser() user: UserWithoutPassword,) {
  return this.categoryService.getById(id);
  }

}
