import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
      throw new UnauthorizedException();

    return userRecord;
  }

  async validateJwtAuth(payload: any): Promise<UserEntity | null> {
    const email = payload.sub as string;
    const userRecord: UserEntity = await this.usersService.findOneBy({ email });

    if (!userRecord) throw new UnauthorizedException();

    return userRecord;
  }

  async login(user: UserEntity) {
    const payload = { sub: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(req: Request, register_dto: CreateUserDTO) {
    return await this.usersService.insert(req, register_dto);
  }
}
