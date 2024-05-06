import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { OTPService } from './otp.service';

@ApiTags('OTP')
@Controller('otp')
export class OTPController {
  constructor(private readonly otp_service: OTPService) {}

  @Put('verify')
  async verify_otp(@Body() otp_verify_dto: OTPVerifyDTO) {
    await this.otp_service.verify_otp(otp_verify_dto);

    return {
      message: `${otp_verify_dto.email} is now verified!`,
    };
  }

  @Get()
  send_otp(@Query('email') email: string) {
    return this.otp_service.send_otp(email);
  }
}
