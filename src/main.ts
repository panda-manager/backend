import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT } from './environments';
import { SetupSwagger } from './utils/swagger/setup';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  SetupSwagger(app);
  await app.listen(APP_PORT);
};

bootstrap().then(() => console.log(`Server is listening on port ${APP_PORT}`));
