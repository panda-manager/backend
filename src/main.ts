import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT, CORS_HANDLER, NODE_ENV } from './environments';
import { SetupSwagger } from './config';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
  const additional_config =
    NODE_ENV == 'production' ? { cors: CORS_HANDLER } : {};

  const app = await NestFactory.create(AppModule, additional_config);

  SetupSwagger(app);
  app.use(morgan('dev'));
  app.use(cookieParser());

  await app.listen(APP_PORT);
};

bootstrap().then(() => Logger.log(`Server is listening on port ${APP_PORT}`));
