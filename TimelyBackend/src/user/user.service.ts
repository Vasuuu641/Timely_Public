import { Injectable, NotFoundException } from '@nestjs/common';
import {User, Prisma } from '../../generated/prisma';
import { UserWithoutPassword } from './type/user-without-password.type';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

// Define the selection object to exclude the password
const userSelect = {
  id: true,
  email: true,
  username: true,
  fullName: true,
  createdAt: true,
  updatedAt: true,
  // Do NOT include 'password: true' here
};


@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(Data: Prisma.UserCreateInput): Promise<UserWithoutPassword>{
    const hashedPassword = await bcrypt.hash(Data.password, 10);
    return this.prismaService.user.create({
      data: {
        username: Data.username,
        password: hashedPassword,
        email: Data.email,
        fullName: Data.fullName
      },
    });
  }

  async findAllUser(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findUserById(id: string): Promise<UserWithoutPassword | null>{
    const curruser =  await this.prismaService.user.findUnique({
      where: {id},
      select: userSelect
    });
    if(!curruser){
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return curruser;
  }

  async findUserByEmail(email: string): Promise<UserWithoutPassword | null>{
    return this.prismaService.user.findUnique({
      where: {email},
      select: userSelect
    });
  }

  async findUserWithPasswordByEmail(email: string): Promise<User | null>{
    return this.prismaService.user.findUnique({
      where: {email},
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<UserWithoutPassword>{
        if (data.password) {
          let plainPassword: string | undefined;
          if (typeof data.password === 'string') {
            plainPassword = data.password;
          } else if (typeof data.password === 'object' && 'set' in data.password) {
            plainPassword = data.password.set;
          }
          if (plainPassword) {
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            // Assign the hashed password back in the correct format
            if (typeof data.password === 'string') {
              data.password = hashedPassword;
            } else if (typeof data.password === 'object' && 'set' in data.password) {
              data.password.set = hashedPassword;
            }
          }
    }
    try {
      return this.prismaService.user.update({
        where: {id},
        data: data as Prisma.UserUpdateInput,
        select: userSelect,
      });
    } catch (error) {
      if(error.code === 'P2025'){ //P2025 prisma error code for record not found
        throw new NotFoundException(`User with ID ${id} not found.`);
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
