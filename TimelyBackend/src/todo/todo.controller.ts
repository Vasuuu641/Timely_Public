import { Controller, Get, Post, Body, Param, Patch, Delete, Request, UnauthorizedException} from "@nestjs/common";
import { ToDoService } from "./todo.service";
import { CreateTodoDto, UpdateToDoDto } from "./dto/create-todo.dto";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";


@Controller('todo')
export class TodoController {
 constructor(private readonly todoService : ToDoService) {}

 // Helper method to get userId from request (adjust this to your auth)
  private getUserId(req: any): string {
    return req.headers['x-user-id'] || null;
  }

 @Post()
 async create(@Body() dto: CreateTodoDto, @Request() req : any) 
 {
    const userId = this.getUserId(req);
    if(!userId)
    {
        throw new UnauthorizedException('User not authenticated!');
    }

  return this.todoService.create(dto, userId);

 }

 @Get()
 async findAll(@Request() req : any)
 {
    const userId = this.getUserId(req);

    if(!userId)
    {
        throw new UnauthorizedException('User not authenticated!');
    }

    return this.todoService.findAll(userId);
 }

 @Get(':id')
 async findOne(@Param('id') id : string, @Request() req : any)
 {
    const userId = this.getUserId(req);

    if(!userId)
    {
        throw new UnauthorizedException('User not authorized!');
    }

  return this.todoService.findOne(+id, userId);

 }

 @Patch(':id')
 async update(@Param('id') id: string, @Body() dto : UpdateToDoDto, @Request() req : any)
 {
    const userId = this.getUserId(req);

    if(!userId)
    {
        throw new UnauthorizedException('User not authorized!');
    }

  return this.todoService.update(+id, dto, userId);

 }

 @Delete(':id')
 remove(@Param('id') id : string, @Request() req : any)
 {

    const userId = this.getUserId(req);

    if(!userId)
    {
        throw new UnauthorizedException('User not authorized!');
    }


  return this.todoService.remove(+id, userId);

 }

 
}