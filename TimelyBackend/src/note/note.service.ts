import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class NoteService {
  constructor(private prismaServices: PrismaService){}

  async create(createNoteDto: Prisma.NoteCreateInput) {
    return this.prismaServices.note.create({data: createNoteDto});
  }

  async findAll() {
    return this.prismaServices.note.findMany();
  }

  findOne(id: string) {
    try {
        return this.prismaServices.note.findUnique({where: { id }}); 
    } catch (error) {
        throw new NotFoundException(`note is not present`);
        console.log(error)
    }
  }

  update(id: string, updateNoteDto: Prisma.NoteUpdateInput) {
    const note = this.findOne(id);
    return this.prismaServices.note.update({
      where: {id},
      data: updateNoteDto
    })
  }

  remove(id: string) {
    try {
        return this.prismaServices.note.delete({
          where: {id}
        })
    } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`did not find notes.`)
        }
        throw error
    };
  }
}
