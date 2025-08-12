import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './auth/user.entity';
import { StripeService } from './billing/stripe.service';
import { DocumentsModule } from './documents/documents.module';
import { AiModule } from './ai/ai.module';
import { CoverLettersModule } from './cover-letters/cover-letters.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { BillingController } from './billing/billing.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        if (!url) {
          return {
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            autoLoadEntities: true,
          } as any;
        }
        return {
          type: 'postgres',
          url,
          synchronize: true,
          autoLoadEntities: true,
        } as any;
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    // Needed for controllers that inject repositories (e.g., BillingController)
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret:
        process.env.NODE_ENV === 'production'
          ? (process.env.JWT_SECRET as string)
          : process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    ProfileModule,
    DocumentsModule,
    AiModule,
    CoverLettersModule,
    JobsModule,
    ApplicationsModule,
  ],
  controllers: [AppController, HealthController, BillingController],
  providers: [
    AppService,
    StripeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
