import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import environments from './environments';
import { CredentialsEntity } from './modules/credentials/entity/credentials.entity';
import { UserEntity } from './modules/user/entity/user.entity';
import ormConfig from '../orm.config';
import { HistoryEntity } from './modules/history/entity/history.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
    UserModule,
    CredentialsModule,
    TypeOrmModule.forRoot({
      entities: [CredentialsEntity, HistoryEntity, UserEntity],
      ...ormConfig,
    }),
  ],
})
export class AppModule {}
