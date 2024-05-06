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
import { OTPEntity } from './modules/otp/entity/otp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
    AuthModule,
    CredentialsModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`!,
      synchronize: true,
      entities: [CredentialsEntity, UserEntity, OTPEntity],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
