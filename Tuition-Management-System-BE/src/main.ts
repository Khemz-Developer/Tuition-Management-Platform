import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

console.log('=== Main.ts loaded - NODE_ENV:', process.env.NODE_ENV, '===');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function bootstrap() {
  try {
    console.log('Bootstrap: Creating NestJS application...');
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug', 'verbose'] });
    console.log('Bootstrap: NestJS application created successfully');

  // Security headers (Helmet) - HSTS, XSS protection, etc.
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(
    helmet({
      hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
      contentSecurityPolicy: isProduction ? undefined : false,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS configuration
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5174',
  ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Parse cookies (required for httpOnly refresh-token flow)
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Check MongoDB connection
  const connection = app.get<Connection>(getConnectionToken());
  
  const checkConnection = () => {
    const dbState = connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    if (dbState === 1) {
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${connection.db?.databaseName || 'unknown'}`);
    } else {
      console.log(`⏳ MongoDB state: ${states[dbState] || 'unknown'}`);
    }

    // Set up connection event listeners
    connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${connection.db?.databaseName || 'unknown'}`);
    });
    connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
  };

  checkConnection();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\n🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`🔍 Health check: http://localhost:${port}/api/health`);
  console.log(`🔍 Database check: http://localhost:${port}/api/health/db\n`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap().catch(err => {
  console.error('❌ Bootstrap error:', err);
  process.exit(1);
});
