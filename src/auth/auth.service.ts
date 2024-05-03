import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../modules/user/entity/user.entity';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { UserService } from '../modules/user/user.service';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwt_service: JwtService,
    private readonly user_service: UserService,
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

    if (payload.exp < Date.now() / 1000) throw new UnauthorizedException();

    return await this.user_service.findOneBy({ email });
  }

  async login(user: UserEntity) {
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

    return await this.user_service.insert(req, register_dto);
  }
}
