import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(CredentialsService.name);

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

    this.logger.debug(
      `Create credentials for user ${user.email} is now attempted.`,
    );

    // TODO: Add insert fail check
    const createdCredentials: CredentialsEntity =
      await this.credentialsRepository.save({
        ...create_dto,
        user_id: user._id,
      });

    this.logger.log(
      `Credentials for host ${create_dto.host} created successfully for user ${user.email}.`,
    );

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

    this.logger.debug(
      `Update credentials for user ${user.email} is now attempted.`,
    );

    const existingCredentials = await this.credentialsRepository.findOneBy({
      user_id: user._id,
      host: update_dto.host,
      login: update_dto.login,
    });

    if (!existingCredentials)
      throw new BadRequestException(`No such credentials for user ${user.email}`);

    else {
      Object.assign(existingCredentials, {
        login: update_dto.new_login,
        password: update_dto.new_password,
        display_name: update_dto.new_display_name,
      });

      this.logger.debug(
        `Found matching credentials for host ${update_dto.host}, user ${user.email}. Attempting update...`,
      );

      const { _id, display_name, host, login } =
        await this.credentialsRepository.save(existingCredentials);

      this.logger.log(
        `Credentials for host ${update_dto.host} updated successfully for user ${user.email}.`,
      );

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

    this.logger.debug(`Attempting to pull all user ${user.email} passwords.`);

    const found: CredentialsEntity[] = await this.credentialsRepository.find({
      where: { user_id: user._id },
    });

    this.logger.log(
      `Found ${found.length} credentials for user ${user.email}.`,
    );

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

    this.logger.debug(
      `Attempting to pull password information for user ${user.email}, host ${host}`,
    );

    const found: CredentialsEntity = await this.credentialsRepository.findOneBy(
      {
        user_id: user._id,
        host: host,
        login: login,
      },
    );

    if (!found)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    this.logger.log(`Found credentials for user ${user.email}, host ${host}.`);
    return found.password;
  }
}
