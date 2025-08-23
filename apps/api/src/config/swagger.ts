import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  DestinationResponseDto,
  DestinationListResponseDto,
  PackageResponseDto,
  PackageListResponseDto,
  PackageCompositionResponseDto,
} from '../modules/catalog/dto/catalog.dto';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Caldera Luxury Travel Platform API')
    .setDescription(
      'Premium travel platform connecting affluent travelers to curated, luxury-certified experiences worldwide.'
    )
    .setVersion('1.0.0')
    .addTag('health', 'Health check endpoints')
    .addTag('catalog', 'Destination and package browsing')
    .addTag('bookings', 'Booking management and pricing')
    .addTag('reviews', 'User reviews and ratings')
    .addTag('webhooks', 'Payment webhook handlers')
    .addTag('mailer', 'Email services')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Register Zod-based response schemas so $ref pointers resolve in Swagger UI
  const ensureComponents = () => {
    (document as any).components = (document as any).components || {};
    (document as any).components.schemas = (document as any).components.schemas || {};
    return (document as any).components.schemas as Record<string, any>;
  };

  const pickNamedDefinition = (jsonSchema: any, name: string) => {
    if (jsonSchema?.definitions?.[name]) return jsonSchema.definitions[name];
    return jsonSchema;
  };

  const schemas = ensureComponents();
  schemas['DestinationResponse'] = pickNamedDefinition(
    zodToJsonSchema(DestinationResponseDto, 'DestinationResponse'),
    'DestinationResponse'
  );
  schemas['DestinationListResponse'] = pickNamedDefinition(
    zodToJsonSchema(DestinationListResponseDto, 'DestinationListResponse'),
    'DestinationListResponse'
  );
  schemas['PackageResponse'] = pickNamedDefinition(
    zodToJsonSchema(PackageResponseDto, 'PackageResponse'),
    'PackageResponse'
  );
  schemas['PackageListResponse'] = pickNamedDefinition(
    zodToJsonSchema(PackageListResponseDto, 'PackageListResponse'),
    'PackageListResponse'
  );
  schemas['PackageCompositionResponse'] = pickNamedDefinition(
    zodToJsonSchema(PackageCompositionResponseDto, 'PackageCompositionResponse'),
    'PackageCompositionResponse'
  );

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Caldera API Documentation',
  });

  return document;
}
