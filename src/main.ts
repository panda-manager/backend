import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupSwagger } from './config';
import * as morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';
import nestConfig from '../nest.config';
import helmet from 'helmet';

const env = configDotenv();
expandDotenv(env);

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, nestConfig);

  SetupSwagger(app);
  app.use(morgan('dev'));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(parseInt(process.env.APP_PORT));
};

bootstrap().then(() =>
  Logger.log(`Server is listening on port ${process.env.APP_PORT}`),
);
