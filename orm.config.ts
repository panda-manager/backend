import { MONGO_CONFIG, NODE_ENV } from './src/environments';

const orm = {
  development: {
    url: MONGO_CONFIG.URL,
    synchronize: true,
  },
  production: {
    url: MONGO_CONFIG.URL,
    ssl: true,
    sslCert: '/ssl/cert.pem',
    sslKey: '/ssl/key.pem',
  },
};

export default orm[NODE_ENV];
