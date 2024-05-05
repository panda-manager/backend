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
import { DeleteCredentialsDTO } from './dto/delete_credentials.dto';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    @InjectRepository(CredentialsEntity)
    private credentials_repository: Repository<CredentialsEntity>,
    private readonly auth_service: AuthService,
  ) {}

  async insert(
    req: Request,
    create_dto: CreateCredentialsDTO,
  ): Promise<AppDisplayedCredentialsDTO> {
    const user = await this.auth_service.validate_jwt(
      req.header('Authorization'),
    );

    this.logger.debug(
      `Create credentials for user ${user.email} is now attempted.`,
    );

    const existing_credentials: CredentialsEntity =
      await this.credentials_repository.findOneBy({
        user_id: user._id,
        host: create_dto.host,
        login: create_dto.login,
      });

    if (existing_credentials)
      throw new BadRequestException(
        `Credentials for the provided host & login already exist for user ${user.email}. If this was intended, use update instead.`,
      );

    const created_credentials: CredentialsEntity =
      await this.credentials_repository.save({
        ...create_dto,
        user_id: user._id,
      });

    this.logger.log(
      `Credentials for host ${create_dto.host} created successfully for user ${user.email}.`,
    );

    return {
      _id: created_credentials._id as ObjectId,
      display_name: created_credentials.display_name,
      host: created_credentials.host,
      login: created_credentials.login,
    };
  }

  async update(
    req: Request,
    update_dto: UpdateCredentialsDTO,
  ): Promise<AppDisplayedCredentialsDTO> {
    const user = await this.auth_service.validate_jwt(
      req.header('Authorization'),
    );

    this.logger.debug(
      `Update credentials for user ${user.email} is now attempted.`,
    );

    const existing_credentials = await this.credentials_repository.findOneBy({
      user_id: user._id,
      host: update_dto.host,
      login: update_dto.login,
    });

    if (!existing_credentials)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );
    else {
      Object.assign(existing_credentials, {
        login: update_dto.new_login,
        password: update_dto.new_password,
        display_name: update_dto.new_display_name,
      });

      this.logger.debug(
        `Found matching credentials for host ${update_dto.host}, user ${user.email}. Attempting update...`,
      );

      const { _id, display_name, host, login } =
        await this.credentials_repository.save(existing_credentials);

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

  async get_app_displayed_credentials(
    req: Request,
  ): Promise<AppDisplayedCredentialsDTO[]> {
    const user = await this.auth_service.validate_jwt(
      req.header('Authorization'),
    );

    this.logger.debug(`Attempting to pull all user ${user.email} passwords.`);

    const found: CredentialsEntity[] = await this.credentials_repository.find({
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

  async get_password(
    req: Request,
    host: string,
    login: string,
  ): Promise<string> {
    const user = await this.auth_service.validate_jwt(
      req.header('Authorization'),
    );

    this.logger.debug(
      `Attempting to pull password information for user ${user.email}, host ${host}`,
    );

    const found: CredentialsEntity =
      await this.credentials_repository.findOneBy({
        user_id: user._id,
        host: host,
        login: login,
      });

    if (!found)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    this.logger.log(`Found credentials for user ${user.email}, host ${host}.`);
    return found.password;
  }

  async remove(req: Request, delete_dto: DeleteCredentialsDTO): Promise<void> {
    const user = await this.auth_service.validate_jwt(
      req.header('Authorization'),
    );

    this.logger.debug(
      `Deleting password for user ${user.email}, host ${delete_dto.host}`,
    );

    const found: CredentialsEntity =
      await this.credentials_repository.findOneBy({
        user_id: user._id,
        host: delete_dto.host,
        login: delete_dto.login,
      });

    if (!found)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    await this.credentials_repository.remove(found);
    this.logger.debug(
      `Credentials for host ${delete_dto.host} deleted for user ${user.email}`,
    );
  }
}
