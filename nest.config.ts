import { Mode } from 'common';
import { CORS_HANDLER, NODE_ENV } from './src/environments';
import { NestApplicationOptions } from '@nestjs/common';

const options: Record<Mode, Partial<NestApplicationOptions>> = {
  development: {
    cors: CORS_HANDLER,
  },
  production: {
    cors: CORS_HANDLER,
  },
};

export default options[NODE_ENV];
