import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO } from 'modules/user/dto/error_response.dto';
import { CredentialsService } from './credentials.service';
import { AuthGuard } from '@nestjs/passport';
import { AppDisplayedCredentialsDTO } from './dto/app_displayed_credentials';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';

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
  constructor(private readonly service: CredentialsService) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: AppDisplayedCredentialsDTO,
  })
  @Post()
  insert(@Req() req: Request, @Body() create_dto: CreateCredentialsDTO) {
    return this.service.insert(req, create_dto);
  }
}
