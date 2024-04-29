import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../modules/user/entity/user.entity';
import { LoginDTO } from './dto/login.dto';
import { UserService } from '../modules/user/user.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}
  async validateUser(user: LoginDTO): Promise<UserEntity> {
    const userRecord = await this.usersService.findOneBy({
      email: user.email,
    });

    if (!userRecord || user.master_password !== userRecord.master_password)
      return null;

    return userRecord;
  }

  async identifyUserFromToken(payload: any): Promise<UserEntity | null> {
    try {
      const userId = payload.sub as string;
      const user: UserEntity = await this.usersService.findOneBy({
        _id: userId,
      });

      if (!user || (payload.exp as number) < Date.now())
        throw new UnauthorizedException();

      return user;
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException();
    }
  }

  async login(user: UserEntity) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
