import { AuthService } from './auth.service';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() login_dto: BasicAuthLoginDTO) {
    const user = await this.authService.validateBasicAuth({
      ...login_dto,
    });

    if (!user) throw new UnauthorizedException();

    return this.authService.login(user);
  }
}
