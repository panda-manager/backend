import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { OTPService } from './otp.service';
import { Request } from 'express';
import { OTPSendDTO } from './dto/otp_send.dto';
import { ResponseDTO } from '../common';

@ApiTags('OTP')
@Controller('otp')
export class OTPController {
  constructor(private readonly otp_service: OTPService) {}

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: 'text/html',
  })
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/html')
  @Get('verify')
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'otp',
    type: String,
    required: true,
  })
  async verify_otp(
    @Query('email') email: string,
    @Query('otp') otp: string,
  ): Promise<string> {
    const otp_verify_dto: OTPVerifyDTO = { email, otp };
    const response_dto: ResponseDTO =
      await this.otp_service.verify_otp(otp_verify_dto);

    return `
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
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  send_otp(
    @Req() req: Request,
    @Body() otp_send_dto: OTPSendDTO,
  ): Promise<ResponseDTO> {
    return this.otp_service.send_otp(req, otp_send_dto.email);
  }
}
