import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CurrentUser } from 'src/authentication/current-user.decorator';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';

@UseGuards(JwtAuthGuard)
@Controller('note')

export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @CurrentUser() user: UserWithoutPassword) {
    return this.noteService.create(createNoteDto, user.id);
  }

  @Get()
  getAll(@CurrentUser() user: UserWithoutPassword) {
    return this.noteService.findAll(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: UserWithoutPassword) {
    return this.noteService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: UserWithoutPassword) {
    return this.noteService.update(id, updateNoteDto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: UserWithoutPassword) {
    return this.noteService.remove(id, user.id);
  }

  }
