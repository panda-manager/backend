import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Put, Query, Req } from '@nestjs/common';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { OTPService } from './otp.service';
import { Request } from 'express';

@ApiTags('OTP')
@Controller('otp')
export class OTPController {
  constructor(private readonly otp_service: OTPService) {}

  @Put('verify')
  verify_otp(@Body() otp_verify_dto: OTPVerifyDTO) {
    return this.otp_service.verify_otp(otp_verify_dto);
  }

  @Get()
  send_otp(@Req() req: Request, @Query('email') email: string) {
    return this.otp_service.send_otp(req, email);
  }
}
