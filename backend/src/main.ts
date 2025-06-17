
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('API CDWEB')
    .setVersion('V1')
    .addBearerAuth()
    .build();
  app.enableCors();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use('/public/img', express.static(join(process.cwd(), 'public/img')));

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);

}
bootstrap();
