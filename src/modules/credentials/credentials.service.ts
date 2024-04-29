import { Injectable } from '@nestjs/common';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CredentialsEntity } from './entity/credentials.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { AppDisplayedCredentialsDTO } from './dto/app_displayed_credentials';
import { ObjectId } from 'mongodb';
import { UpdateCredentialsDTO } from './dto/update_credentials.dto';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(CredentialsEntity)
    private credentialsRepository: Repository<CredentialsEntity>,
    private readonly authService: AuthService,
  ) {}

  async insert(
    req: Request,
    create_dto: CreateCredentialsDTO,
  ): Promise<AppDisplayedCredentialsDTO> {
    const user = await this.authService.validateJwtAuth(
      req.header('Authorization'),
    );

    const createdCredentials: CredentialsEntity =
      await this.credentialsRepository.save({
        ...create_dto,
        user_id: user._id,
      });

    return {
      _id: createdCredentials._id as ObjectId,
      display_name: createdCredentials.display_name,
      host: createdCredentials.host,
      login: createdCredentials.login,
    };
  }

  async update(
    req: Request,
    update_dto: UpdateCredentialsDTO,
  ): Promise<AppDisplayedCredentialsDTO> {
    const user = await this.authService.validateJwtAuth(
      req.header('Authorization'),
    );

    const existingCredentials = await this.credentialsRepository.findOneBy({
      user_id: user._id,
      host: update_dto.old_host,
      login: update_dto.old_login,
    });

    if (existingCredentials) {
      Object.assign(existingCredentials, {
        login: update_dto.login,
        host: update_dto.host,
        password: update_dto.password,
        display_name: update_dto.display_name,
      });

      const { _id, display_name, host, login } =
        await this.credentialsRepository.save(existingCredentials);

      return {
        _id,
        display_name,
        host,
        login,
      } as AppDisplayedCredentialsDTO;
    }
  }

  async getAppDisplayedCredentials(
    req: Request,
  ): Promise<AppDisplayedCredentialsDTO[]> {
    const user = await this.authService.validateJwtAuth(
      req.header('Authorization'),
    );

    const found: CredentialsEntity[] = await this.credentialsRepository.find({
      where: { user_id: user._id },
    });

    return found.map((item: CredentialsEntity) => {
      const { _id, display_name, host, login } = item;

      return {
        _id,
        display_name,
        host,
        login,
      } as AppDisplayedCredentialsDTO;
    });
  }

  async getPassword(
    req: Request,
    host: string,
    login: string,
  ): Promise<string> {
    const user = await this.authService.validateJwtAuth(
      req.header('Authorization'),
    );

    const found: CredentialsEntity = await this.credentialsRepository.findOneBy(
      {
        user_id: user._id,
        host: host,
        login: login,
      },
    );

    return found.password;
  }
}
