import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  Logger,
} from '@nestjs/common';
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
import { ResponseDTO } from '../common';
import { getDeviceIdentifier } from '../modules/user/device_identifier';
import { UserStatus } from '../modules/user/enum/user_status';

@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);
  constructor(
    @InjectRepository(OTPEntity)
    private otp_repository: Repository<OTPEntity>,
    private readonly user_service: UserService,
    private readonly config_service: ConfigService,
  ) {}

  async verifyOTP(otpVerifyDTO: OTPVerifyDTO): Promise<ResponseDTO> {
    const user = await this.user_service.findOneBy({
      email: otpVerifyDTO.email,
    });

    if (!user)
      throw new BadRequestException(
        `No such user with email ${otpVerifyDTO.email}`,
      );

    const foundOTP = await this.otp_repository.findOneBy({
      user_id: user._id,
      otp: otpVerifyDTO.otp,
    });

    if (!foundOTP)
      throw new BadRequestException(
        `No such OTP found for user ${otpVerifyDTO.email}`,
      );

    await this.user_service.setDeviceVerified(user, foundOTP.device);
    this.logger.debug(`Verified device for user ${otpVerifyDTO.email}`);
    await this.otp_repository.remove(foundOTP);

    return {
      message: `${foundOTP.device} is now verified for user ${otpVerifyDTO.email}!`,
    };
  }

  private async send_verification_email(
    email: string,
    otp: string,
  ): Promise<void> {
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
                   <p>Please visit this link to verify the device you requested the code from:</p>
                   <a href=${this.config_service.get('APP_URL')}/otp/verify?otp=${otp}&email=${email}>Click here!</a>
            </body>
            </html>`,
    );

    this.logger.debug(`OTP mail sent successfully to ${email}`);
  }

  async sendOTP(req: Request, email: string): Promise<ResponseDTO> {
    const device = getDeviceIdentifier(req);

    const user = await this.user_service.findOneBy({
      email,
    });

    if (!user)
      throw new BadRequestException(`No such user with email ${email}`);
    else if (
      user.devices.find((element) => element.identifier === device)?.status ===
      UserStatus.VERIFIED
    )
      throw new ImATeapotException(
        `Device ${device} is already verified for user ${user.email}`,
      );

    let otp = generateOtp(6);
    let result = await this.otp_repository.findOneBy({ otp });

    while (result) {
      otp = generateOtp(6);
      result = await this.otp_repository.findOneBy({ otp });
    }

    const otp_payload = {
      user_id: user._id,
      otp,
      device,
    };

    await this.otp_repository.save(otp_payload);
    await this.user_service.addDevice(user, device);
    await this.send_verification_email(email, otp);

    const message = `OTP generated for user ${user.email}, device ${otp_payload.device}`;
    this.logger.log(message);

    return { message };
  }
}
