import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO } from 'modules/user/dto/error_response.dto';
import { CredentialsService } from './credentials.service';
import { AuthGuard } from '@nestjs/passport';
import { AppDisplayedCredentialsDTO } from './dto/app_displayed_credentials';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { UpdateCredentialsDTO } from './dto/update_credentials.dto';

@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  type: ErrorResponseDTO,
})
@ApiResponse({
  status: 403,
  description: 'Forbidden',
  type: ErrorResponseDTO,
})
@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentials_service: CredentialsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: 201,
    type: AppDisplayedCredentialsDTO,
  })
  @Post()
  insert(@Req() req: Request, @Body() create_dto: CreateCredentialsDTO) {
    return this.credentials_service.insert(req, create_dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: 200,
    type: AppDisplayedCredentialsDTO,
  })
  @Put()
  update(@Req() req: Request, @Body() update_dto: UpdateCredentialsDTO) {
    return this.credentials_service.update(req, update_dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: 200,
    type: [AppDisplayedCredentialsDTO],
  })
  @Get()
  get_all(@Req() req: Request) {
    return this.credentials_service.get_app_displayed_credentials(req);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: 200,
    type: String,
  })
  @Get('password')
  get_password(
    @Req() req: Request,
    @Query('host') host: string,
    @Query('login') login: string,
  ) {
    return this.credentials_service.get_password(req, host, login);
  }
}
