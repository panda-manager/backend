import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { CreateUserDTO } from '../models/user/dto/create_user.dto';
import { Request } from 'express';
import { ApiOkResponse } from '@nestjs/swagger';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Access token for future requests. Valid for 1h',
    type: AccessTokenResponseDTO,
  })
  async login(@Body() login_dto: BasicAuthLoginDTO) {
    const user = await this.auth_service.validate_basic_auth({
      ...login_dto,
    });

    return this.auth_service.generate_jwt(user);
  }

  @Post('register')
  async register(@Req() req: Request, @Body() register_dto: CreateUserDTO) {
    await this.auth_service.register(req, {
      ...register_dto,
    });

    return {
      message:
        'User created successfully. You can now login. !! OTP will be added here !!',
    };
  }
}
