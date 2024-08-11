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
import { CreateUserDTO } from '../user/dto/create_user.dto';
import { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ResponseDTO } from '../../common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({
    description: 'Access token for future requests',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDTO: BasicAuthLoginDTO): Promise<ResponseDTO> {
    return await this.authService.login(loginDTO);
  }

  @ApiCreatedResponse({
    description: 'User created, OTP sent to email',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() registerDTO: CreateUserDTO,
  ): Promise<ResponseDTO> {
    return await this.authService.register(req, registerDTO);
  }
}
