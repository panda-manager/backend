import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
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
import { ResponseDTO } from '../common';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { getDeviceIdentifier } from '../modules/user/device_identifier';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly otpService: OTPService,
  ) {}
  async login(req: Request, user: BasicAuthLoginDTO): Promise<UserEntity> {
    this.logger.log(`Login attempted for user ${user.email}`);

    const userEntity = await this.userService.findOneBy({
      email: user.email,
    });

    if (!userEntity || user.master_password !== userEntity.master_password)
      throw new UnauthorizedException('Username or password are incorrect!');

    const requestDevice = userEntity.devices.find(
      (item) => item.identifier === getDeviceIdentifier(req),
    );

    if (!requestDevice)
      await this.userService.addDevice(userEntity, getDeviceIdentifier(req));
    else if (requestDevice.status === UserStatus.PENDING_VERIFICATION)
      await this.userService.setDeviceVerified(
        userEntity,
        getDeviceIdentifier(req),
      );

    // TODO: Re-add
    // if (
    //   !requestDevice ||
    //   requestDevice.status === UserStatus.PENDING_VERIFICATION
    // )
    // throw new ForbiddenException(
    //   'Requested device is not a trusted device. ' +
    //     'POST Request to /otp from this device to get an OTP with your email and verify it from the link in the mail',
    // );

    return userEntity;
  }

  async generateJWT(
    req: Request,
    user: UserEntity,
  ): Promise<AccessTokenResponseDTO> {
    if (!user) throw new UnauthorizedException();

    const accessToken = this.jwtService.sign({
      sub: user.email,
      device: getDeviceIdentifier(req),
    });

    return { access_token: accessToken };
  }

  async register(
    req: Request,
    createUserDTO: CreateUserDTO,
  ): Promise<ResponseDTO> {
    const isEmailTaken = await this.userService.findOneBy({
      email: createUserDTO.email,
    });

    if (isEmailTaken)
      throw new BadRequestException(
        'The email address provided is already taken!',
      );

    await this.userService.insert(req, createUserDTO);

    // TODO: Delete
    const newUser = await this.userService.findOneBy({
      email: createUserDTO.email,
    });

    await this.userService.setDeviceVerified(newUser, getDeviceIdentifier(req));

    // TODO: Re-add
    // await this.otpService.send_otp(req, createUserDTO.email);
    // this.logger.log(`Account ${createUserDTO.email} created, OTP sent.`);

    return {
      message: 'Account created successfully!',
      // 'Account created. An OTP was sent to the provided email address.',
    };
  }

  async getUserProfile(req: Request): Promise<UserEntity> {
    if (req.user instanceof UserEntity) return req.user;

    const jwt = req.headers.authorization.split(' ')[1];
    const payload = this.jwtService.decode(jwt);
    const found = await this.userService.findOneBy({ email: payload.sub });

    if (!found) throw new UnauthorizedException();

    return found;
  }

  async validateMasterPassword(
    req: Request,
    masterPassword: string,
  ): Promise<ResponseDTO> {
    const user = await this.getUserProfile(req);

    if (user.master_password !== masterPassword)
      throw new ForbiddenException('Password is incorrect');

    return {
      message: 'Validation succeeded!',
    };
  }
}
