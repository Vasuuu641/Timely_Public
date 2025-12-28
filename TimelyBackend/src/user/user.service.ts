import { Injectable, NotFoundException } from '@nestjs/common';
import {User, Prisma } from '../../generated/prisma';
import { UserWithoutPassword } from './type/user-without-password.type';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

// Define the selection object to exclude the password
const userSelect = {
  id: true,
  email: true,
  username: true,
  fullname: true,
  createdAt: true,
  updatedAt: true,
  // Do NOT include 'password: true' here
};


@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(dto : CreateUserDto): Promise<UserWithoutPassword>{
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prismaService.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        fullname: dto.fullname,
        password: hashedPassword,
      },
      select: userSelect
    });
  }

  async findAllUser(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findUserById(id: string): Promise<UserWithoutPassword | null>{
    const user =  await this.prismaService.user.findUnique({
      where: {id},
      select: userSelect
    });
    if(!user){
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserWithPasswordByEmail(email: string): Promise<User | null>{
    return this.prismaService.user.findUnique({
      where: {email},
    });
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserWithoutPassword> {
    const data: Prisma.UserUpdateInput = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    try {
      return this.prismaService.user.update({
        where: { id },
        data,
        select: userSelect,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }
  
  async deleteUser(id: string): Promise<UserWithoutPassword>{
    try {
      return this.prismaService.user.delete({
        where: {id},
        select: userSelect
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} does not exist`);
      }
      throw error
    }
  }
}
