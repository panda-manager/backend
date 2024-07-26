import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from '../../common';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ValidateMasterDTO } from '../../auth/dto/validate_master.dto';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { JwtGuard } from '../../auth/jwt.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly user_service: UserService) {}

  @ApiOkResponse({
    description: 'User master password validation',
    type: ResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/validate/master')
  async validate_master_password(
    @Req() req: Request,
    @Body() validate_master_dto: ValidateMasterDTO,
  ): Promise<ResponseDTO> {
    return this.user_service.validate_master_password(
      req,
      validate_master_dto.master_password,
    );
  }

  @ApiOkResponse({
    description: 'User entity for email',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/find')
  async find(@Query('email') email: string): Promise<ResponseDTO> {
    const found: UserEntity = await this.user_service.findOneBy({
      email,
    });

    return {
      message: !found ? 'No such user' : 'User found',
      data: found,
    };
  }
}
