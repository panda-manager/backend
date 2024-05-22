import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupSwagger } from './config';
import * as morgan from 'morgan';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import nestConfig from '../nest.config';
import helmet from 'helmet';
import { APP_PORT } from './environments';
declare const module: any & { hot: any };

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, nestConfig);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  SetupSwagger(app);
  app.use(morgan('dev'));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(APP_PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};

bootstrap().then(() => Logger.log(`Server is listening on port ${APP_PORT}`));
