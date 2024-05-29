import { MONGO_URL, NODE_ENV } from './src/environments';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

type Mode = 'development' | 'production';

const orm: Record<Mode, Partial<TypeOrmModuleOptions>> = {
  development: {
    type: 'mongodb',
    url: MONGO_URL,
    synchronize: true,
  },
  production: {
    type: 'mongodb',
    url: MONGO_URL,
    ssl: true,
    sslCert: 'ssl/cert.pem',
    sslKey: 'ssl/key.pem',
  },
};

export default orm[NODE_ENV];
