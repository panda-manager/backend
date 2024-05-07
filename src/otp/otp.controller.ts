import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { OTPService } from './otp.service';
import { Request } from 'express';
import { OTPSendDTO } from './dto/otp_send.dto';

@ApiTags('OTP')
@Controller('otp')
export class OTPController {
  constructor(private readonly otp_service: OTPService) {}

  @Put('verify')
  verify_otp(@Body() otp_verify_dto: OTPVerifyDTO) {
    return this.otp_service.verify_otp(otp_verify_dto);
  }

  @Post()
  send_otp(@Req() req: Request, @Body() otp_send_dto: OTPSendDTO) {
    return this.otp_service.send_otp(req, otp_send_dto.email);
  }
}
