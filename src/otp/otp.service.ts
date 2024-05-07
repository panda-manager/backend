import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../modules/user/user.service';
import { OTPEntity } from './entity/otp.entity';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { generate as generateOtp } from 'otp-generator';
import mailSender from '../utils/mail-sender';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import device_identifier from '../modules/user/device_identifier';
@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);
  constructor(
    @InjectRepository(OTPEntity)
    private otp_repository: Repository<OTPEntity>,
    private readonly user_service: UserService,
    private readonly config_service: ConfigService,
  ) {}

  async verify_otp(otp_verify_dto: OTPVerifyDTO) {
    const user = await this.user_service.findOneBy({
      email: otp_verify_dto.email,
    });

    if (!user)
      throw new BadRequestException(
        `No such user with email ${otp_verify_dto.email}`,
      );

    const found_otp = await this.otp_repository.findOneBy({
      user_id: user._id,
      otp: otp_verify_dto.otp,
    });

    if (!found_otp)
      throw new BadRequestException(
        `No such OTP found for user ${otp_verify_dto.email}`,
      );

    await this.user_service.set_device_as_verified(user, found_otp.device);
    this.logger.debug(`Verified device for user ${otp_verify_dto.email}`);
    await this.otp_repository.remove(found_otp);

    return {
      message: `${found_otp.device} is now verified for user $${otp_verify_dto.email}!`,
    };
  }

  async send_verification_email(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: this.config_service.get('OTP_MAIL_ACCOUNT').HOST,
      port: this.config_service.get('OTP_MAIL_ACCOUNT').PORT,
      auth: {
        user: this.config_service.get('OTP_MAIL_ACCOUNT').USER,
        pass: this.config_service.get('OTP_MAIL_ACCOUNT').PASS,
      },
      name: this.config_service.get('OTP_MAIL_ACCOUNT').HOST,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    await mailSender(
      transporter,
      email,
      this.config_service.get('OTP_MAIL_ACCOUNT').USER,
      'Verification Email',
      `<html lang="en">
            <body>
            <h1>Please confirm your OTP</h1>
                   <p>Here is your OTP code: ${otp}</p>
            </body>
            </html>`,
    );

    this.logger.debug(`OTP mail sent successfully to ${email}`);
  }

  async send_otp(req: Request, email: string) {
    const user = await this.user_service.findOneBy({
      email,
    });

    if (!user)
      throw new BadRequestException(`No such user with email ${email}`);

    let otp = generateOtp(6);
    let result = await this.otp_repository.findOneBy({ otp });

    while (result) {
      otp = generateOtp(6);
      result = await this.otp_repository.findOneBy({ otp });
    }

    const otp_payload = {
      user_id: user._id,
      otp,
      device: req[device_identifier],
    };

    await this.otp_repository.save(otp_payload);
    await this.send_verification_email(email, otp);

    const message = `OTP generated for user ${user.email}, device ${otp_payload.device}`;
    this.logger.log(message);

    return {
      message,
    };
  }
}
