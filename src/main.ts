import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS_HANDLER } from './environments';
import { SetupSwagger } from './config';
import * as morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';

const env = configDotenv();
expandDotenv(env);

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { cors: CORS_HANDLER });

  SetupSwagger(app);
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(parseInt(process.env.APP_PORT));
};

bootstrap().then(() =>
  Logger.log(`Server is listening on port ${process.env.APP_PORT}`),
);
