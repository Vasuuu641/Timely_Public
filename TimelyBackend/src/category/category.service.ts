import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { name: dto.name},
    });
  }

  async getAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }
}
