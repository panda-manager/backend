import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { ResponseDTO } from '../common';
import { AuthGuard } from '@nestjs/passport';
import { ValidateMasterDTO } from './dto/validate_master.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}
  @ApiOkResponse({
    description: 'Access token for future requests',
    type: AccessTokenResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() login_dto: BasicAuthLoginDTO,
  ): Promise<AccessTokenResponseDTO> {
    const user = await this.auth_service.login(req, {
      ...login_dto,
    });

    return this.auth_service.generate_jwt(req, user);
  }

  @ApiCreatedResponse({
    description: 'User created, OTP sent to email',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() register_dto: CreateUserDTO,
  ): Promise<ResponseDTO> {
    return await this.auth_service.register(req, {
      ...register_dto,
    });
  }

  @ApiOkResponse({
    description: 'User master password validation',
    type: ResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('/validate/master')
  async validate_master_password(
    @Req() req: Request,
    @Body() validate_master_dto: ValidateMasterDTO,
  ): Promise<ResponseDTO> {
    return this.auth_service.validate_master_password(
      req,
      validate_master_dto.master_password,
    );
  }
}
