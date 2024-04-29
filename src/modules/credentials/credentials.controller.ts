import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly credentialsService: CredentialsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AppDisplayedCredentialsDTO,
  })
  @Post()
  insert(@Req() req: Request, @Body() create_dto: CreateCredentialsDTO) {
    return this.credentialsService.insert(req, create_dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AppDisplayedCredentialsDTO,
  })
  @Put()
  update(@Req() req: Request, @Body() update_dto: UpdateCredentialsDTO) {
    return this.credentialsService.update(req, update_dto);
  }
}
