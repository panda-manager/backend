import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { OTPService } from './otp.service';
import { Request, Response } from 'express';
import { OTPSendDTO } from './dto/otp_send.dto';

@ApiTags('OTP')
@Controller('otp')
export class OTPController {
  constructor(private readonly otp_service: OTPService) {}

  @Get('verify')
  async verify_otp(
    @Query('email') email: string,
    @Query('otp') otp: string,
    @Res() res: Response,
  ) {
    const otp_verify_dto = {
      email,
      otp,
    } as OTPVerifyDTO;

    const response_dto = await this.otp_service.verify_otp(otp_verify_dto);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Sample HTML Page</title>
      </head>
      <body>
        <h2>${response_dto.message}</h2>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  }

  @Post()
  send_otp(@Req() req: Request, @Body() otp_send_dto: OTPSendDTO) {
    return this.otp_service.send_otp(req, otp_send_dto.email);
  }
}
