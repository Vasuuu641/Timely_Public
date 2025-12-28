import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from 'generated/prisma';
import { UserWithoutPassword } from './type/user-without-password.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Controller('user') //Base path for user related API route
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post()
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
async create(@Body() dto: CreateUserDto) {
  try {
    const user = await this.userService.createUser(dto);
    return { message: 'User created successfully', user }; // optional
  } catch (err: any) {
    if (err.code === 'P2002') { // Prisma unique constraint violation
      return { message: 'Email or username already exists' };
    }
    throw err;
  }
}


  @UseGuards(JwtAuthGuard)
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
  async update(@Param('id') id: string, @Body() dto : UpdateUserDto): Promise<UserWithoutPassword>{
    const updateUser = await this.userService.updateUser(id,dto);
    
    
    return updateUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const deletedUser = await this.userService.deleteUser(id);
    
    
    return deletedUser;
  }
}
