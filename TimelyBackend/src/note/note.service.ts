import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService){}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    return this.prisma.note.create({
    data:
    {
      ...createNoteDto,
      user: { connect: { id: userId } },

    },
    });
  }

  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: {userId},
      orderBy: { createdAt: 'desc' }, 
    });
  }

  async findOne(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({
      where: {id},
    });

    if (!note || note.userId !== userId) {
      throw new NotFoundException(`Note with ID ${id} not found.`);
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.note.update({
      where: {id},
      data: updateNoteDto
    })
  }

  async remove(id: string, userId: string) {
   const note = await this.findOne(id, userId);

    return this.prisma.note.delete({
      where: {id: note.id},
    });
  }
}
