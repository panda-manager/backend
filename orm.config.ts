import { MONGO_CONFIG, NODE_ENV } from './src/environments';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

type Mode = 'development' | 'production';

const orm: Record<Mode, Partial<TypeOrmModuleOptions>> = {
  development: {
    type: 'mongodb',
    url: MONGO_CONFIG.URL,
    synchronize: true,
  },
  production: {
    type: 'mongodb',
    url: MONGO_CONFIG.URL,
    ssl: true,
    sslCert: '/mnt/ssl/cert.pem',
    sslKey: '/mnt/ssl/key.pem',
  },
};

export default orm[NODE_ENV];
