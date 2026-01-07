import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FeatureUsageModule } from 'src/feature-usage/featureUsage.module';

@Module({
  imports: [PrismaModule, FeatureUsageModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
