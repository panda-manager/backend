import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configDotenv } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { expand as expandDotenv } from 'dotenv-expand';
import { UserService } from 'modules/user/user.service';
import { UserEntity } from 'modules/user/entity/user.entity';
import { JwtPayload } from 'jsonwebtoken';

const env = configDotenv();
expandDotenv(env);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(
    payload: JwtPayload & { device: string },
  ): Promise<UserEntity> {
    // TODO: Add device check
    const { exp, sub } = payload;
    const found = await this.userService.findOneBy({ email: sub });

    if (!found || (exp && exp < Date.now() / 1000))
      throw new UnauthorizedException();

    return found;
  }
}
