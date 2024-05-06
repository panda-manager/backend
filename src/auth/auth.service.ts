import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../modules/user/entity/user.entity';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { UserService } from '../modules/user/user.service';
import { Request } from 'express';
import { UserStatus } from '../modules/user/enum/user_status';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';
import { OTPService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwt_service: JwtService,
    private readonly user_service: UserService,
    private readonly otp_service: OTPService,
  ) {}
  async validate_basic_auth(
    req: Request,
    user: BasicAuthLoginDTO,
  ): Promise<UserEntity> {
    this.logger.log(`Login attempted for user ${user.email}`);

    const user_record = await this.user_service.findOneBy({
      email: user.email,
    });

    if (!user_record || user.master_password !== user_record.master_password)
      throw new UnauthorizedException('Username or password are incorrect!');

    const request_device = user_record.devices.find(
      (item) => item.identifier == req.hostname,
    );

    if (
      !request_device ||
      request_device.status == UserStatus.PENDING_VERIFICATION
    )
      throw new ForbiddenException(
        'Requested device is not a trusted device. ' +
          'Use a GET /otp?email=account.email.com request from this device to get an OTP, and verify it using a PUT /otp/verify (from whatever device)',
      );

    return user_record;
  }

  async validate_jwt(payload: any): Promise<UserEntity | null> {
    const { exp, email } : { exp: number, email: string } = payload;

    const found = await this.user_service.findOneBy({ email });

    if (!found || (exp && exp < Date.now() / 1000))
      throw new UnauthorizedException();

    return found;
  }

  async generate_jwt(req: Request, user: UserEntity) {
    if (!user) throw new UnauthorizedException();

    return {
      access_token: this.jwt_service.sign({
        sub: user.email,
        device: req.hostname,
      }),
    };
  }

  async register(req: Request, register_dto: CreateUserDTO) {
    const is_email_taken = await this.user_service.findOneBy({
      email: register_dto.email,
    });

    if (is_email_taken)
      throw new BadRequestException(
        'The email address provided is already taken!',
      );

    await this.user_service.insert(req, register_dto);
    await this.otp_service.send_otp(req, register_dto.email);

    return {
      message:
        'Account created. An OTP was sent to the provided email address. Make a PUT request to /otp/verify with the provided code.' +
        'To generate a new one, make a GET request to /otp with a query parameter named email with the registered email address',
    };
  }

  get_user_profile(req: Request) {
    return this.validate_jwt(req.header('Authorization'));
  }
}
