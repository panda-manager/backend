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
    private repository: Repository<OTPEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async verifyOTP(otpVerifyDTO: OTPVerifyDTO): Promise<ResponseDTO> {
    const user = await this.userService.findOneBy({
      email: otpVerifyDTO.email,
    });

    if (!user)
      throw new BadRequestException(
        `No such user with email ${otpVerifyDTO.email}`,
      );

    const foundOTP = await this.repository.findOneBy({
      user_id: user._id,
      otp: otpVerifyDTO.otp,
    });

    if (!foundOTP)
      throw new BadRequestException(
        `No such OTP found for user ${otpVerifyDTO.email}`,
      );

    await this.userService.setDeviceVerified(user, foundOTP.device);
    this.logger.debug(`Verified device for user ${otpVerifyDTO.email}`);
    await this.repository.remove(foundOTP);

    return {
      message: `${foundOTP.device} is now verified for user ${otpVerifyDTO.email}!`,
    };
  }

  private async sendVerificationEmail(
    email: string,
    otp: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('OTP_MAIL_ACCOUNT').HOST,
      port: this.configService.get('OTP_MAIL_ACCOUNT').PORT,
      auth: {
        user: this.configService.get('OTP_MAIL_ACCOUNT').USER,
        pass: this.configService.get('OTP_MAIL_ACCOUNT').PASS,
      },
      name: this.configService.get('OTP_MAIL_ACCOUNT').HOST,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    await mailSender(
      transporter,
      email,
      this.configService.get('OTP_MAIL_ACCOUNT').USER,
      'Verification Email',
      `<html lang="en">
            <body>
            <h1>Please confirm your OTP</h1>
                   <p>Here is your OTP code: ${otp}</p>
                   <p>Please visit this link to verify the device you requested the code from:</p>
                   <a href=${this.configService.get('APP_URL')}/otp/verify?otp=${otp}&email=${email}>Click here!</a>
            </body>
            </html>`,
    );

    this.logger.debug(`OTP mail sent successfully to ${email}`);
  }

  async sendOTP(req: Request, email: string): Promise<ResponseDTO> {
    const device = getDeviceIdentifier(req);

    const user = await this.userService.findOneBy({
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
    let result = await this.repository.findOneBy({ otp });

    while (result) {
      otp = generateOtp(6);
      result = await this.repository.findOneBy({ otp });
    }

    const otpPayload: Partial<OTPEntity> = {
      user_id: user._id,
      otp,
      device,
    };

    await this.repository.save(otpPayload);
    await this.userService.addDevice(user, device);
    await this.sendVerificationEmail(email, otp);

    const message = `OTP generated for user ${user.email}, device ${otpPayload.device}`;
    this.logger.log(message);

    return { message };
  }
}
