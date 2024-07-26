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
import { ValidateMasterDTO } from './dto/validate_master.dto';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({
    description: 'Access token for future requests',
    type: AccessTokenResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() loginDTO: BasicAuthLoginDTO,
  ): Promise<AccessTokenResponseDTO> {
    const user = await this.authService.login(req, loginDTO);
    return this.authService.generateJWT(req, user);
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

  // TODO: Delete
  @ApiOkResponse({
    description: 'User master password validation',
    type: ResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/validate/master')
  async validateMasterPassword(
    @Req() req: Request,
    @Body() validateMasterDTO: ValidateMasterDTO,
  ): Promise<ResponseDTO> {
    return this.authService.validateMasterPassword(
      req,
      validateMasterDTO.master_password,
    );
  }
}
