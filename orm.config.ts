import { Mode } from 'common';
import { MONGO_URL, NODE_ENV } from './src/environments';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const orm: Record<Mode, Partial<TypeOrmModuleOptions>> = {
  development: {
    type: 'mongodb',
    url: MONGO_URL,
    synchronize: true,
    database: 'panda-manager',
  },
  production: {
    type: 'mongodb',
    url: MONGO_URL,
    ssl: true,
    sslCert: 'ssl/mongo_key_cert.pem',
    sslKey: 'ssl/mongo_key_cert.pem',
    database: 'panda-manager',
  },
};

export default orm[NODE_ENV];
