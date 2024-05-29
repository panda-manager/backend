import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupSwagger } from './config';
import * as morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import nestConfig from '../nest.config';
import helmet from 'helmet';
import { APP_PORT } from './environments';
import { fix_pem_files } from './utils/certs-parser';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, nestConfig);

  SetupSwagger(app);
  app.use(morgan('dev'));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(APP_PORT);
};

fix_pem_files();
bootstrap().then(() => Logger.log(`Server is listening on port ${APP_PORT}`));
