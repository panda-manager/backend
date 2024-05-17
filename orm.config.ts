import { MONGO_CONFIG, NODE_ENV } from './src/environments';

const orm = {
  development: {
    url: MONGO_CONFIG.URL,
    synchronize: true,
  },
  production: {
    url: MONGO_CONFIG.URL,
    ssl: true,
    sslCert: MONGO_CONFIG.CERT,
    sslKey: MONGO_CONFIG.KEY,
  },
};

export default orm[NODE_ENV];
