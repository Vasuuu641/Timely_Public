import { NestFactory } from '@nestjs/core';
require('dotenv').config();
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // --- START CORS CONFIGURATION ---
  app.enableCors({
    // 'origin' specifies which domains are allowed to access your backend API.
    // It's the most critical setting.
    // For local development, allow your React frontend's URL:
    origin: 'http://localhost:5173', // <<< IMPORTANT: Replace with your React frontend's actual URL if different

    // 'methods' defines which HTTP methods (GET, POST, PUT, DELETE, etc.) are allowed.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    // 'credentials' indicates whether the browser should send cookies or HTTP authentication
    // headers (like Authorization headers for JWTs) with cross-origin requests.
    // Set to `true` if your frontend will be sending authentication tokens (e.g., JWTs).
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
