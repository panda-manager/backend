import { CORS_HANDLER } from './src/environments';

const options = {
  development: {},
  testing: {},
  staging: {},
  production: {
    cors: CORS_HANDLER,
  },
};

export default options[process.env.NODE_ENV];
