import { NestFactory } from '@nestjs/core';
require('dotenv').config();
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // --- START CORS CONFIGURATION ---
  app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://timely-public.vercel.app',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
  // --- END CORS CONFIGURATION ---

  // Enable global DTO validation pipes (as discussed in previous steps)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));

  const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000
  await app.listen(port);
  console.log(`Backend server listening on port ${port}`);
}
bootstrap();
