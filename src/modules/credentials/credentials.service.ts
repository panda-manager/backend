import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CredentialsEntity } from './entity/credentials.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(CredentialsEntity)
    private credentialsRepository: Repository<CredentialsEntity>,
    private readonly authService: AuthService,
  ) {}

  async insert(req: Request, create_dto: CreateCredentialsDTO) {
    const user = await this.authService.validateJwtAuth(
      req.header('Authorization'),
    );

    if (!user) throw new UnauthorizedException();

    return await this.credentialsRepository.save({
      ...create_dto,
      user_id: user._id.toString(),
    });
  }
}
