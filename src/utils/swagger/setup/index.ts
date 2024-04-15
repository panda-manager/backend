import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { APP_URL } from '../../../environments';
import { APP_NAME } from '../../../shared';

export const SetupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(APP_NAME)
    .addServer(APP_URL)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document);
};
