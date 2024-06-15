import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CredentialsEntity } from './entity/credentials.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { UpdateCredentialsDTO } from './dto/update_credentials.dto';
import { DeleteCredentialsDTO } from './dto/delete_credentials.dto';
import { GetPasswordDTO } from './dto/get_password.dto';
import { ResponseDTO } from '../../common';
import { RestoreCredentialsDTO } from './dto/restore_credentials.dto';

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
  ): Promise<ResponseDTO> {
    const user = await this.auth_service.get_user_profile(req);

    this.logger.debug(
      `Create credentials for user ${user.email} is now attempted.`,
    );

    const existing_credentials: CredentialsEntity =
      await this.credentials_repository.findOneBy({
        user_id: user._id,
        host: create_dto.host,
        login: create_dto.login,
        deleted: false,
      });

    if (existing_credentials)
      throw new BadRequestException(
        `Credentials for the provided host & login already exist for user ${user.email}. If this was intended, use update instead.`,
      );

    const created_credentials: CredentialsEntity =
      await this.credentials_repository.save({
        ...create_dto,
        user_id: user._id,
        deleted: false,
      });

    const message = `Credentials for host ${create_dto.host} created successfully for user ${user.email}.`;

    this.logger.log(message);

    return {
      message,
      data: {
        display_name: created_credentials.display_name,
        host: created_credentials.host,
        login: created_credentials.login,
      } as CredentialsEntity,
    } as ResponseDTO;
  }

  async update(
    req: Request,
    update_dto: UpdateCredentialsDTO,
  ): Promise<ResponseDTO> {
    const user = await this.auth_service.get_user_profile(req);

    this.logger.debug(
      `Update credentials for user ${user.email} is now attempted.`,
    );

    const existing_credentials = await this.credentials_repository.findOneBy({
      user_id: user._id,
      host: update_dto.host,
      login: update_dto.login,
      deleted: false,
    });

    if (!existing_credentials)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    Object.assign(existing_credentials, {
      password: update_dto.new_password,
      login: update_dto.new_login ?? existing_credentials.login,
      display_name:
        update_dto.new_display_name ?? existing_credentials.display_name,
    });

    this.logger.debug(
      `Found matching credentials for host ${update_dto.host}, user ${user.email}. Attempting update...`,
    );

    const { display_name, host, login } =
      await this.credentials_repository.save(existing_credentials);

    const message = `Credentials for host ${update_dto.host} updated successfully for user ${user.email}.`;
    this.logger.log(message);

    return {
      message,
      data: {
        display_name,
        host,
        login,
      } as CredentialsEntity,
    } as ResponseDTO;
  }

  async get_app_displayed_credentials(
    req: Request,
    host?: string,
  ): Promise<CredentialsEntity[]> {
    const user = await this.auth_service.get_user_profile(req);

    this.logger.debug(`Attempting to pull all user ${user.email} passwords.`);

    const found: CredentialsEntity[] = await this.credentials_repository.find({
      where: host
        ? { user_id: user._id, host: host, deleted: false }
        : { user_id: user._id, deleted: false },
    });

    this.logger.log(
      `Found ${found.length} credentials for user ${user.email}.`,
    );

    return found;
  }

  async get_password(
    req: Request,
    get_password_dto: GetPasswordDTO,
  ): Promise<string> {
    const user = await this.auth_service.get_user_profile(req);

    this.logger.debug(
      `Attempting to pull password information for user ${user.email}, host ${get_password_dto.host}`,
    );

    const found: CredentialsEntity =
      await this.credentials_repository.findOneBy({
        user_id: user._id,
        host: get_password_dto.host,
        login: get_password_dto.login,
        deleted: false,
      });

    if (!found)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    this.logger.log(
      `Found credentials for user ${user.email}, host ${get_password_dto.host}.`,
    );
    return found.password;
  }

  async remove(
    req: Request,
    delete_dto: DeleteCredentialsDTO,
  ): Promise<ResponseDTO> {
    const user = await this.auth_service.get_user_profile(req);

    this.logger.debug(
      `Deleting credentials for user ${user.email}, host ${delete_dto.host}`,
    );

    const existing_credentials: CredentialsEntity =
      await this.credentials_repository.findOneBy({
        user_id: user._id,
        host: delete_dto.host,
        login: delete_dto.login,
        deleted: false,
      });

    if (!existing_credentials)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    if (delete_dto.deletion_type === 'hard')
      await this.credentials_repository.remove(existing_credentials);
    else {
      Object.assign(existing_credentials, {
        deleted: true,
      });

      await this.credentials_repository.save(existing_credentials);
    }

    const message = `Credentials for host ${delete_dto.host} deleted for user ${user.email}`;
    this.logger.debug(message);

    return {
      message,
    } as ResponseDTO;
  }

  async has_any(req: Request, host: string): Promise<ResponseDTO> {
    const has_any_credentials: boolean =
      (await this.get_app_displayed_credentials(req, host)).length > 0;

    return {
      message: has_any_credentials
        ? 'Matching credentials found'
        : `No credentials for host ${host}`,
      data: has_any_credentials,
    };
  }

  async restore(req: Request, restore_dto: RestoreCredentialsDTO) {
    const user = await this.auth_service.get_user_profile(req);

    this.logger.debug(
      `Restoring credentials for user ${user.email}, host ${restore_dto.host}`,
    );

    const existing_credentials: CredentialsEntity =
      await this.credentials_repository.findOneBy({
        user_id: user._id,
        host: restore_dto.host,
        login: restore_dto.login,
        deleted: true,
      });

    if (!existing_credentials)
      throw new BadRequestException(
        `No such deleted credentials for user ${user.email}`,
      );

    Object.assign(existing_credentials, {
      deleted: false,
    });

    await this.credentials_repository.save(existing_credentials);

    const message = `Credentials for host ${restore_dto.host} restored for user ${user.email}`;
    this.logger.debug(message);

    return {
      message,
    } as ResponseDTO;
  }
}
