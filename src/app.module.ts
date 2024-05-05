import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CredentialsModule } from './models/credentials/credentials.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGO_URL } from './environments';
import { CredentialsEntity } from './models/credentials/entity/credentials.entity';
import { UserEntity } from './models/user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CredentialsModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: MONGO_URL!,
      synchronize: true,
      entities: [CredentialsEntity, UserEntity],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
