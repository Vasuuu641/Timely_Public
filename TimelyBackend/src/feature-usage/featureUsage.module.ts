// src/feature-usage/feature-usage.module.ts
import { Module } from '@nestjs/common';
import { FeatureUsageService } from './featureUsage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FeatureUsageService],
  exports: [FeatureUsageService],
})
export class FeatureUsageModule {}
