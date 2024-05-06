import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
  async validate_basic_auth(user: BasicAuthLoginDTO): Promise<UserEntity> {
    this.logger.log(`Login attempted for user ${user.email}`);

    const user_record = await this.user_service.findOneBy({
      email: user.email,
    });

    if (!user_record || user.master_password !== user_record.master_password)
      throw new UnauthorizedException('Username or password are incorrect!');

    return user_record;
  }

  async validate_jwt(payload: any): Promise<UserEntity | null> {
    const email = payload.sub as string;
    const found = await this.user_service.findOneBy({ email });

    if ((payload.exp && payload.exp < Date.now() / 1000) || !found)
      throw new UnauthorizedException();

    if (found.status == UserStatus.PENDING_VERIFICATION)
      throw new ForbiddenException('Account is pending OTP verification!');

    return found;
  }

  async generate_jwt(user: UserEntity) {
    if (!user) throw new UnauthorizedException();

    return {
      access_token: this.jwt_service.sign({ sub: user.email }),
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
    await this.otp_service.send_otp(register_dto.email);

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
