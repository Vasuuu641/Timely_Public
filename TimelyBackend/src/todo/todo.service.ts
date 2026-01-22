import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateToDoDto } from "./dto/update-todo.dto";

@Injectable() 

export class ToDoService
{
    constructor(private prisma : PrismaService) {}

create(dto: CreateTodoDto, userId : string) {
const { title, description, dueDate, priority} = dto;
return this.prisma.todo.create({
data: {
    title,
    description,
    dueDate: dueDate? new Date(dueDate): undefined,
    priority,
    user: {
    connect: { id: userId }, // this connects the Todo to the existing User
          },
      },
  });
}


findAll(userId : string)
{
    return this.prisma.todo.findMany({
        where : {userId},
    });
}

findOne(id : number, userId : string)
{
    return this.prisma.todo.findFirst({
        where: {id, userId},
    })
}

update(id : number, dto : UpdateToDoDto, userId : string)
{
    return this.prisma.todo.updateMany({
        where : {id, userId},
        data : dto,
    });
}

remove(id : number, userId: string)
{
    return this.prisma.todo.deleteMany({
        where : {id, userId},
    });
}

}



