import { Controller, Get, Post, Body, Param, Patch, Delete, Request, UnauthorizedException} from "@nestjs/common";
import { ToDoService } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateToDoDto } from "./dto/update-todo.dto";
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CurrentUser } from "src/authentication/current-user.decorator";
import { UserWithoutPassword } from "src/user/type/user-without-password.type";
import { FeatureUsageService, FeatureName } from "src/feature-usage/featureUsage.service";

@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
 constructor(private readonly todoService : ToDoService, private readonly featureUsageService:FeatureUsageService) {}

 @Post()
 async create(@Body() dto: CreateTodoDto, @CurrentUser() user: UserWithoutPassword)
 {
    const userId = user.id;
    if(!userId)
    {
        throw new UnauthorizedException('User not authenticated!');
    }

  return this.todoService.create(dto, userId);

 }

 @Get()
 async findAll(@CurrentUser() user: UserWithoutPassword)
 {
    await this.featureUsageService.trackUsage(
        user.id,
        FeatureName.TODO
    )
    
    const userId = user.id;

    if(!userId)
    {
        throw new UnauthorizedException('User not authenticated!');
    }

    return this.todoService.findAll(userId);
 }

 @Get(':id')
 async findOne(@Param('id') id : string, @CurrentUser() user: UserWithoutPassword)
 {
    const userId = user.id;

    if(!userId)
    {
        throw new UnauthorizedException('User not authorized!');
    }

  return this.todoService.findOne(+id, userId);

 }

 @Patch(':id')
 async update(@Param('id') id: string, @Body() dto : UpdateToDoDto, @CurrentUser() user: UserWithoutPassword)
 {
    const userId = user.id;

    if(!userId)
    {
        throw new UnauthorizedException('User not authorized!');
    }

  return this.todoService.update(+id, dto, userId);

 }

 @Delete(':id')
 remove(@Param('id') id : string, @CurrentUser() user: UserWithoutPassword)
 {

    const userId = user.id;

    if(!userId)
    {
        throw new UnauthorizedException('User not authorized!');
    }


  return this.todoService.remove(+id, userId);

 }

 
}