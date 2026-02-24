import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SearchNotesDto } from './dto/search-notes.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService){}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    await this.assertCategoryExists(createNoteDto.category);

    const category = await this.prisma.category.findUnique({
      where: {id: createNoteDto.category},
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        categoryId: createNoteDto.category,
        userId,

        tags: createNoteDto.tags
          ? {
              create: createNoteDto.tags.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tag },
                    create: { name: tag },
                  },
                },
              })),
            }
          : undefined,
      },
    });
  }

  async findAll(userId: string) {
  return this.prisma.note.findMany({
    where: { userId },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20, // important: avoid dumping everything
  });
}


  async findOne(id: string, userId: string) {
  const note = await this.prisma.note.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!note) {
    throw new NotFoundException('Note not found');
  }

  return note;
}


  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string) {

  await this.findOne(id, userId);

  await this.assertCategoryExists(updateNoteDto.category);

  if (updateNoteDto.category) {
    const category = await this.prisma.category.findUnique({
      where: { id: updateNoteDto.category },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  return this.prisma.note.update({
    where: { id },
    data: {
      title: updateNoteDto.title,
      content: updateNoteDto.content,
      categoryId: updateNoteDto.category ?? undefined,

      tags: updateNoteDto.tags
        ? {
            deleteMany: {},
            create: updateNoteDto.tags.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
            })),
          }
        : undefined,
    },
  });
}

  async remove(id: string, userId: string) {
   const note = await this.findOne(id, userId);

    return this.prisma.note.delete({
      where: {id: note.id},
    });
  }

 async searchNotes(userId: string, filters: SearchNotesDto) {
  const { categoryId, query, tags } = filters;

  if (categoryId) {
    await this.assertCategoryExists(categoryId);
  }

  return this.prisma.note.findMany({
    where: {
      userId,
      categoryId,

      AND: [
        query
          ? {
              OR: [
                {
                  title: {
                    contains: query,
                  },
                },
                {
                  content: {
                    contains: query,
                  },
                },
              ],
            }
          : {},

        tags?.length
          ? {
              tags: {
                some: {
                  tag: {
                    name: {
                      in: tags,
                    },
                  },
                },
              },
            }
          : {},
      ],
    },

    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
}

private async assertCategoryExists(categoryId: string) {
  const exists = await this.prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!exists) {
    throw new NotFoundException('Category not found');
  }
}


}

