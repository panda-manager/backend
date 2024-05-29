import { MONGO_CONFIG, NODE_ENV } from './src/environments';

const orm = {
  development: {
    url: MONGO_CONFIG.URL,
    synchronize: true,
  },
  production: {
    url: MONGO_CONFIG.URL,
    ssl: true,
    sslCert: '/mnt/ssl/cert.pem',
    sslKey: '/mnt/ssl/key.pem',
  },
};

export default orm[NODE_ENV];
