import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  app.enableCors();
  app.disable('x-powered-by', 'X-Powered-By');
  const config = new DocumentBuilder()
    .setTitle('Starwar Backend')
    .setDescription('Starwar backend operations API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  logger.log(
    `Starting application on http://localhost:${configService.get('PORT')}/docs`,
  );
  await app.listen(configService.get('PORT') as number);
}
bootstrap();
