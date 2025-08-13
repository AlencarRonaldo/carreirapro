import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from './auth/user.entity';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  // Basic runtime guard for required secrets in production
  if (process.env.NODE_ENV === 'production') {
    const missing: string[] = [];
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
    if (!process.env.REFRESH_SECRET) missing.push('REFRESH_SECRET');
    if (missing.length) {
      // Fail fast to avoid running with default secrets
      throw new Error(
        `Variáveis obrigatórias ausentes em produção: ${missing.join(', ')}`,
      );
    }
  }
  app.enableCors({
    origin: [
      /^http:\/\/localhost:\d+$/,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Seed demo users if missing (dev only)
  const ds = app.get(DataSource);
  try {
    const repo = ds.getRepository(UserEntity);

    // Demo user - starter plan
    const demoEmail = 'demo@carreirapro.app';
    const demoExists = await repo.findOne({ where: { email: demoEmail } });
    if (!demoExists) {
      const demoUser = repo.create({
        email: demoEmail,
        passwordHash: bcrypt.hashSync('demo123', 10),
        name: 'Demo User',
        plan: 'starter',
        subscriptionStatus: 'active',
      });
      await repo.save(demoUser);
    }

    // Pro test user
    const proEmail = 'test@carreirapro.app';
    const proExists = await repo.findOne({ where: { email: proEmail } });
    if (!proExists) {
      const proUser = repo.create({
        email: proEmail,
        passwordHash: bcrypt.hashSync('test123', 10),
        name: 'Test Pro User',
        plan: 'pro',
        subscriptionStatus: 'active',
      });
      await repo.save(proUser);
    }
  } catch {}
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
