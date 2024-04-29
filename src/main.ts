import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT, MONGO_URL } from './environments';
import { SetupSwagger } from './config';
import * as cookieParser from 'cookie-parser';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  SetupSwagger(app);
  app.use(cookieParser());
  await app.listen(APP_PORT);
};

bootstrap().then(() => console.log(`Server is listening on port ${APP_PORT}`));
