import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../modules/user/entity/user.entity';
import { LoginDTO } from './dto/login.dto';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}
  async validateBasicAuth(user: LoginDTO): Promise<UserEntity> {
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
}
