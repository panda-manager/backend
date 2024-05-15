import { MONGO_CONFIG, NODE_ENV } from './src/environments';

const orm = {
  development: {
    url: MONGO_CONFIG.URL,
  },
  production: {
    url: MONGO_CONFIG.URL,
  },
};

export default orm[NODE_ENV];
