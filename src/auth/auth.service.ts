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
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}
  async validateBasicAuth(user: BasicAuthLoginDTO): Promise<UserEntity> {
    this.logger.log(`Login attempted for user ${user.email}`);

    const userRecord = await this.usersService.findOneBy({
      email: user.email,
    });

    if (!userRecord || user.master_password !== userRecord.master_password)
      throw new UnauthorizedException('Username or password are incorrect!');

    return userRecord;
  }

  async validateJwtAuth(payload: any): Promise<UserEntity | null> {
    const email = payload.sub as string;

    //TODO: Validate jwt payload

    if (payload.exp < Date.now() / 1000) throw new UnauthorizedException();

    return await this.usersService.findOneBy({ email });
  }

  async login(user: UserEntity) {
    const payload = { sub: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(req: Request, register_dto: CreateUserDTO) {
    const is_email_taken = await this.usersService.findOneBy({
      email: register_dto.email,
    });

    if (is_email_taken)
      throw new BadRequestException(
        'The email address provided is already taken!',
      );

    return await this.usersService.insert(req, register_dto);
  }
}
