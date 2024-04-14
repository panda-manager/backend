import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT } from './environments';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(APP_PORT);
};

bootstrap().then(() => console.log(`Server is listening on port ${APP_PORT}`));
