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
import { request, Request } from 'express';
import { UserStatus } from '../modules/user/enum/user_status';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';
import { OTPService } from '../otp/otp.service';
import { ResponseDTO } from '../common';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { getDeviceIdentifier } from '../modules/user/device_identifier';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwt_service: JwtService,
    private readonly user_service: UserService,
    private readonly otp_service: OTPService,
  ) {}
  async login(req: Request, user: BasicAuthLoginDTO): Promise<UserEntity> {
    this.logger.log(`Login attempted for user ${user.email}`);

    const user_record = await this.user_service.findOneBy({
      email: user.email,
    });

    if (!user_record || user.master_password !== user_record.master_password)
      throw new UnauthorizedException('Username or password are incorrect!');

    const request_device = user_record.devices.find(
      (item) => item.identifier === getDeviceIdentifier(req),
    );

    if (!request_device)
      await this.user_service.add_device(user_record, getDeviceIdentifier(req));
    else if (request_device.status === UserStatus.PENDING_VERIFICATION)
      await this.user_service.set_device_as_verified(
        user_record,
        getDeviceIdentifier(req),
      );

    // TODO: Re-add
    // if (
    //   !request_device ||
    //   request_device.status === UserStatus.PENDING_VERIFICATION
    // )
    // throw new ForbiddenException(
    //   'Requested device is not a trusted device. ' +
    //     'POST Request to /otp from this device to get an OTP with your email and verify it from the link in the mail',
    // );

    return user_record;
  }

  async generate_jwt(
    req: Request,
    user: UserEntity,
  ): Promise<AccessTokenResponseDTO> {
    if (!user) throw new UnauthorizedException();

    const access_token = this.jwt_service.sign({
      sub: user.email,
      device: getDeviceIdentifier(req),
    });

    return { access_token };
  }

  async register(
    req: Request,
    register_dto: CreateUserDTO,
  ): Promise<ResponseDTO> {
    const is_email_taken = await this.user_service.findOneBy({
      email: register_dto.email,
    });

    if (is_email_taken)
      throw new BadRequestException(
        'The email address provided is already taken!',
      );

    await this.user_service.insert(req, register_dto);

    // TODO: Delete this
    const inserted_user = await this.user_service.findOneBy({
      email: register_dto.email,
    });

    await this.user_service.set_device_as_verified(
      inserted_user,
      getDeviceIdentifier(req),
    );

    // TODO: Re-add
    // await this.otp_service.send_otp(req, register_dto.email);
    // this.logger.log(`Account ${register_dto.email} created, OTP sent.`);

    return {
      message: 'Account created successfully!',
      // 'Account created. An OTP was sent to the provided email address.',
    };
  }

  async get_user_profile(req: Request): Promise<UserEntity> {
    if (req.user instanceof UserEntity) return req.user;

    const jwt = req.headers.authorization.split(' ')[1];
    const payload = this.jwt_service.decode(jwt);
    const found = await this.user_service.findOneBy({ email: payload.sub });

    if (!found) throw new UnauthorizedException();

    return found;
  }

  async validate_master_password(
    req: Request,
    master_password: string,
  ): Promise<ResponseDTO> {
    const user = await this.get_user_profile(req);

    if (user.master_password !== master_password)
      throw new ForbiddenException('Password is incorrect');

    return {
      message: 'Validation succeeded!',
    };
  }
}
