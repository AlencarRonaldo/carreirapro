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
      throw new Error(`Variáveis obrigatórias ausentes em produção: ${missing.join(', ')}`);
    }
  }
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Seed demo user if missing (dev only)
  const ds = app.get(DataSource);
  try {
    const repo = ds.getRepository(UserEntity);
    const demoEmail = 'demo@carreirapro.app';
    const exists = await repo.findOne({ where: { email: demoEmail } });
    if (!exists) {
      const user = repo.create({ email: demoEmail, passwordHash: bcrypt.hashSync('demo123', 10) });
      await repo.save(user);
    }
  } catch {}
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
