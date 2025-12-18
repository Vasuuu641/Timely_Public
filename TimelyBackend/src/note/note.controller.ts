import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Prisma } from 'generated/prisma';
import { connect } from 'http2';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  private getuserId(req: any){
    return req.headers['x-user-id'] || 'test-user-123';
  }
  
  @Post()
  create(@Body() createNoteDto: Prisma.NoteCreateInput, @Req() req: any) {
    const userId = this.getuserId(req)
    const newNote = {
      ...createNoteDto,
      user: {
        connect : {id: userId}
      }
    };
    return this.noteService.create(newNote);
  }

  @Get()
  findAll() {
    return this.noteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: Prisma.NoteUpdateInput) {
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteService.remove(id);
  }
}
