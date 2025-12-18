import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from 'generated/prisma';
import { UserWithoutPassword } from './type/user-without-password.type';
import { emit } from 'process';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user') //Base path for user related API route
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  async create(@Body() CreateUserDto: Prisma.UserCreateInput){
    return this.userService.createUser(CreateUserDto);
  }

  @Get()
  async findAll(): Promise<UserWithoutPassword[]> {
    return this.userService.findAllUser();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`user with ID ${id} not found`);
    }

    return user;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  async update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput): Promise<UserWithoutPassword>{
    const updateUser = await this.userService.updateUser(id,updateUserDto);
    
    
    return updateUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const deletedUser = await this.userService.deleteUser(id);
    
    
    return deletedUser;
  }
}
