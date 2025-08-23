import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './modules/health/health.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      // load from app-local first, then monorepo root as fallback
      envFilePath: ['.env.local', '.env', '../../.env'],
    }),

    // Health checks
    TerminusModule,
    HealthModule,

    // Feature modules
    CatalogModule,
    BookingsModule,
    ReviewsModule,
    WebhooksModule,
    MailerModule,
  ],
})
export class AppModule {
  
}
