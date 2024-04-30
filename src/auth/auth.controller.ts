import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login_dto: BasicAuthLoginDTO) {
    const user = await this.authService.validateBasicAuth({
      ...login_dto,
    });

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Req() req: Request, @Body() register_dto: CreateUserDTO) {
    await this.authService.register(req, {
      ...register_dto,
    });

    return {
      message:
        'User created successfully. You can now login. !! OTP will be added here !!',
    };
  }
}
