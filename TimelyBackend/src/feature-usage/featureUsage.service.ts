// src/feature-usage/feature-usage.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum FeatureName {
  NOTES = 'NOTES',
  TODO = 'TODO',
  POMODORO = 'POMODORO',
  SCHEDULE = 'SCHEDULE',
  QUIZ = 'QUIZ',
  GOALS = 'GOALS',
}


@Injectable()
export class FeatureUsageService {
  constructor(private prisma: PrismaService) {}

  async trackUsage(userId: string, feature: FeatureName) {
    await this.prisma.featureUsage.upsert({
      where: {
        userId_feature: {
          userId,
          feature,
        },
      },
      update: {
        usageCount: { increment: 1 },
        lastUsed: new Date(),
      },
      create: {
        userId,
        feature,
        usageCount: 1,
        lastUsed: new Date(),
      },
    });
  }

  async getTopFeatures(userId: string, limit = 4) {
    return this.prisma.featureUsage.findMany({
      where: { userId },
      orderBy: [
        { usageCount: 'desc' },
        { lastUsed: 'desc' },
      ],
      take: limit,
    });
  }

  private featureRouteMap: Record<FeatureName, string> = {
  [FeatureName.NOTES]: '/note',
  [FeatureName.TODO]: '/todo',
  [FeatureName.POMODORO]: '/pomodoro',
  [FeatureName.SCHEDULE]: '/schedule',
  [FeatureName.QUIZ]: '/quiz',
  [FeatureName.GOALS]: '/goal',
};

async getQuickActions(userId: string, limit = 4) {
  const features = await this.getTopFeatures(userId, limit);

  return features.map(f => ({
    feature: f.feature,
    route: this.featureRouteMap[f.feature as FeatureName],
  }));
}

}
