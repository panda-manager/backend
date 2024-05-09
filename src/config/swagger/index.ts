import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { APP_NAME } from '../../common';

export const SetupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle(APP_NAME)
    .addServer(process.env.APP_URL)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document);
};
