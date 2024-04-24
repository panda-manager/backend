import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
import { ACCESS_TOKEN_SECRET } from '../environments';

@Module({
  imports: [
    // UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET!,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  // providers: [AuthService, LocalStrategy, JwtStrategy],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
