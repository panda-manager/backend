import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entity/user.entity';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { CreateUserDTO } from '../user/dto/create_user.dto';
import { ResponseDTO } from '../../common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async login(loginDTO: BasicAuthLoginDTO): Promise<ResponseDTO> {
    this.logger.log(`Login attempted for user ${loginDTO.email}`);

    const user = await this.userService.findOneBy({
      email: loginDTO.email,
    });

    if (!user || loginDTO.master_password !== user.master_password)
      throw new UnauthorizedException('Username or password are incorrect!');

    return {
      data: user,
    };
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
    this.logger.log(`Account ${createUserDTO.email} created`);

    return {
      message: 'Account created successfully!',
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
}
