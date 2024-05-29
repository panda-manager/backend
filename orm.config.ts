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
    sslCert: 'ssl/mongo_key_cert.pem',
    sslKey: 'ssl/mongo_key_cert.pem',
  },
};

export default orm[NODE_ENV];
