import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './environments';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
};

bootstrap().then(() => console.log(`Server is listening on port ${PORT}`));
