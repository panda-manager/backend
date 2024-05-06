import { Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { AuthModule } from '../../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialsEntity } from './entity/credentials.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CredentialsEntity])],
  controllers: [CredentialsController],
  providers: [CredentialsService],
})
export class CredentialsModule {}
