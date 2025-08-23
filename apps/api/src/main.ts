import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import { GlobalHttpExceptionFilter } from './lib/errors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // CORS
  app.enableCors({
    origin: configService.get('NODE_ENV') === 'production' 
      ? [configService.get('APP_BASE_URL')]
      : true,
    credentials: true,
  });

  // Setup Swagger (dev only)
  if (configService.get('NODE_ENV') !== 'production') {
    setupSwagger(app);
  }

  const port = configService.get('APP_PORT', 4000);
  await app.listen(port);

  console.log(`🚀 Caldera API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🌍 Environment: ${configService.get('NODE_ENV')}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
