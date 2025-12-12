import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Declare a private property to hold the PrismaClient instance
  private prisma: PrismaClient; // Make sure this line is correct

  constructor() {
    super(); // call the parent PrismaClient constructor
  }


  async onModuleInit() {
    console.log('PrismaService: Connecting to DB...');
    await this.$connect();
    console.log('PrismaService: DB Connected!');
  }

  async onModuleDestroy() {
    console.log('PrismaService: Disconnecting from DB...');
    await this.$disconnect();
    console.log('PrismaService: DB Disconnected!');
  }

  // You can keep or remove enableShutdownHooks based on your needs.
  // If you keep it, remember to call it from main.ts or elsewhere.
  // For now, let's keep it as it was provided.
  async enableShutdownHooks(app: INestApplication) {
    // Ensure this `this.prisma.$on` is correctly structured if you enable query logging etc.
    // However, for application shutdown, the `OnModuleDestroy` handles database disconnection.
    // This specific line can cause issues if not subscribed to a valid event name.
    // For general graceful shutdown, NestJS usually handles it without manual $on('beforeExit').
    // Let's comment it out to resolve this specific compiler error.
    // this.prisma.$on('beforeExit', async () => {
    //    await app.close();
    // });
    // If you need more advanced shutdown handling, look into NestJS lifecycle events
    // or how Prisma recommends integrating shutdown hooks for your specific version.
  }

  // This is the getter method you want
  get client(): PrismaClient {
    return this.prisma;
  }
}