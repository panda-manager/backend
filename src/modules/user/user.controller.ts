import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { AddDeviceDTO } from './dto/add_device.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return this.userService.validateMasterPassword(
      req,
      validateMasterDTO.master_password,
    );
  }

  @ApiOkResponse({
    description: 'User entity for email',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/find')
  async find(@Query('email') email: string): Promise<ResponseDTO> {
    const found: UserEntity = await this.userService.findOneBy({
      email,
    });

    return {
      message: !found ? 'No such user' : 'User found',
      data: found,
    };
  }

  @ApiCreatedResponse({
    description: 'Device created for user',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/device')
  async addDevice(@Body() addDeviceDTO: AddDeviceDTO): Promise<ResponseDTO> {
    const found: UserEntity = await this.userService.findOneBy({
      email: addDeviceDTO.email,
    });

    await this.userService.addDevice(found, addDeviceDTO.device);
    return {
      message: `Device ${addDeviceDTO.device} was added to user's ${addDeviceDTO.email} devices with PENDING_VERIFICATION status`,
    };
  }
}
