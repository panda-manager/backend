import { CORS_HANDLER, NODE_ENV } from './src/environments';

const options = {
  development: {
    cors: CORS_HANDLER,
  },
  production: {
    cors: CORS_HANDLER,
  },
};

export default options[NODE_ENV];
