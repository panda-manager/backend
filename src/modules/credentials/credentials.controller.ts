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
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { UpdateCredentialsDTO } from './dto/update_credentials.dto';
import { DeleteCredentialsDTO } from './dto/delete_credentials.dto';
import { GetPasswordDTO } from './dto/get_password.dto';
import { ResponseDTO } from '../../common';
import { CredentialsEntity } from './entity/credentials.entity';
import { RestoreCredentialsDTO } from './dto/restore_credentials.dto';
import { JwtGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@ApiTags('Credentials')
@UseGuards(JwtGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  insert(
    @Req() req: Request,
    @Body() createCredentialsDTO: CreateCredentialsDTO,
  ): Promise<ResponseDTO> {
    return this.credentialsService.insert(req, createCredentialsDTO);
  }

  @ApiCreatedResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Put()
  update(
    @Req() req: Request,
    @Body() updateCredentialsDTO: UpdateCredentialsDTO,
  ): Promise<ResponseDTO> {
    return this.credentialsService.update(req, updateCredentialsDTO);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  @Post('password')
  getPassword(
    @Req() req: Request,
    @Body() getPasswordDTO: GetPasswordDTO,
  ): Promise<string> {
    return this.credentialsService.getPassword(req, getPasswordDTO);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [CredentialsEntity],
  })
  @ApiQuery({
    name: 'host',
    type: String,
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getAll(
    @Req() req: Request,
    @Query('host') host?: string,
  ): Promise<CredentialsEntity[]> {
    return this.credentialsService.getAppDisplayedCredentials(req, host);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Delete()
  remove(
    @Req() req: Request,
    @Body() deleteDTO: DeleteCredentialsDTO,
  ): Promise<ResponseDTO> {
    return this.credentialsService.remove(req, deleteDTO);
  }

  @ApiQuery({
    name: 'host',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Get('existence')
  hasAny(
    @Req() req: Request,
    @Query('host') host: string,
  ): Promise<ResponseDTO> {
    return this.credentialsService.hasAny(req, host);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Put('restore')
  restore(
    @Req() req: Request,
    @Body() restoreCredentialsDTO: RestoreCredentialsDTO,
  ) {
    return this.credentialsService.restore(req, restoreCredentialsDTO);
  }
}
