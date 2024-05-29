import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import environments from './environments';
import { CredentialsEntity } from './modules/credentials/entity/credentials.entity';
import { UserEntity } from './modules/user/entity/user.entity';
import { OTPEntity } from './otp/entity/otp.entity';
import ormConfig from '../orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
    AuthModule,
    CredentialsModule,
    TypeOrmModule.forRoot({
      entities: [CredentialsEntity, UserEntity, OTPEntity],
      ...ormConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
