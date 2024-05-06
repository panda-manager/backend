import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../modules/user/user.module';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';
import { OTPEntity } from './entity/otp.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([OTPEntity])],
  controllers: [OTPController],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
