import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CredentialsService } from './credentials.service';
import { AuthGuard } from '@nestjs/passport';
import { AppDisplayedCredentialsDTO } from './dto/app_displayed_credentials';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { UpdateCredentialsDTO } from './dto/update_credentials.dto';
import { DeleteCredentialsDTO } from './dto/delete_credentials.dto';
import { GetPasswordDTO } from './dto/get_password.dto';
import { ResponseDTO } from '../../common';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentials_service: CredentialsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  insert(
    @Req() req: Request,
    @Body() create_dto: CreateCredentialsDTO,
  ): Promise<ResponseDTO> {
    return this.credentials_service.insert(req, create_dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Put()
  update(
    @Req() req: Request,
    @Body() update_dto: UpdateCredentialsDTO,
  ): Promise<ResponseDTO> {
    return this.credentials_service.update(req, update_dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  @Post('password')
  get_password(
    @Req() req: Request,
    @Body() get_password_dto: GetPasswordDTO,
  ): Promise<string> {
    return this.credentials_service.get_password(req, get_password_dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [AppDisplayedCredentialsDTO],
  })
  @ApiQuery({
    name: 'host',
    type: String,
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  get_all(
    @Req() req: Request,
    @Query('host') host?: string,
  ): Promise<AppDisplayedCredentialsDTO[]> {
    return this.credentials_service.get_app_displayed_credentials(req, host);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Delete()
  remove(
    @Req() req: Request,
    @Body() delete_dto: DeleteCredentialsDTO,
  ): Promise<ResponseDTO> {
    return this.credentials_service.remove(req, delete_dto);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'host',
    type: String,
    required: true,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Get('existence')
  has_any(
    @Req() req: Request,
    @Query('host') host: string,
  ): Promise<ResponseDTO> {
    return this.credentials_service.has_any(req, host);
  }
}
