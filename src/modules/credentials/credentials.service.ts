import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CredentialsEntity } from './entity/credentials.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UpdateCredentialsDTO } from './dto/update_credentials.dto';
import { DeleteCredentialsDTO } from './dto/delete_credentials.dto';
import { GetPasswordDTO } from './dto/get_password.dto';
import { ResponseDTO } from '../../common';
import { RestoreCredentialsDTO } from './dto/restore_credentials.dto';
import { HistoryService } from '../history/history.service';
import { HistoryEntity } from '../history/entity/history.entity';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    @InjectRepository(CredentialsEntity)
    private repository: Repository<CredentialsEntity>,
    private readonly historyService: HistoryService,
    private readonly authService: AuthService,
  ) {}

  async insert(
    req: Request,
    createCredentialsDTO: CreateCredentialsDTO,
  ): Promise<ResponseDTO> {
    const user = await this.authService.getUserProfile(req);

    this.logger.debug(
      `Create credentials for user ${user.email} is now attempted.`,
    );

    const existing_credentials: CredentialsEntity =
      await this.repository.findOneBy({
        user_id: user._id,
        host: createCredentialsDTO.host,
        login: createCredentialsDTO.login,
        deleted: false,
      });

    if (existing_credentials)
      throw new BadRequestException(
        `Credentials for the provided host & login already exist for user ${user.email}. If this was intended, use update instead.`,
      );

    const createdCredentials: CredentialsEntity = await this.repository.save({
      ...createCredentialsDTO,
      user_id: user._id,
      deleted: false,
    });

    const message = `Credentials for host ${createCredentialsDTO.host} created successfully for user ${user.email}.`;

    this.logger.log(message);

    return {
      message,
      data: {
        display_name: createdCredentials.display_name,
        host: createdCredentials.host,
        login: createdCredentials.login,
      } as CredentialsEntity,
    } as ResponseDTO;
  }

  async update(
    req: Request,
    updateCredentialsDTO: UpdateCredentialsDTO,
  ): Promise<ResponseDTO> {
    const user = await this.authService.getUserProfile(req);

    this.logger.debug(
      `Update credentials for user ${user.email} is now attempted.`,
    );

    const existingCredentials = await this.repository.findOneBy({
      user_id: user._id,
      host: updateCredentialsDTO.host,
      login: updateCredentialsDTO.login,
      deleted: false,
    });

    if (!existingCredentials)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    this.logger.debug(
      `Found matching credentials for host ${updateCredentialsDTO.host}, user ${user.email}. Attempting update...`,
    );

    await this.historyService.insert(existingCredentials);
    await this.repository.remove(existingCredentials);

    const { display_name, host, login } = await this.repository.save({
      user_id: existingCredentials.user_id,
      host: existingCredentials.host,
      password: updateCredentialsDTO.new_password,
      deleted: false,
      login: updateCredentialsDTO.new_login ?? existingCredentials.login,
      display_name:
        updateCredentialsDTO.new_display_name ??
        existingCredentials.display_name,
    } as CredentialsEntity);

    const message = `Credentials for host ${updateCredentialsDTO.host} updated successfully for user ${user.email}.`;
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

  async getAppDisplayedCredentials(
    req: Request,
    host?: string,
  ): Promise<CredentialsEntity[]> {
    const user = await this.authService.getUserProfile(req);

    this.logger.debug(`Attempting to pull all user ${user.email} passwords.`);

    const found: CredentialsEntity[] = await this.repository.find({
      where: host
        ? { user_id: user._id, host: host, deleted: false }
        : { user_id: user._id, deleted: false },
    });

    this.logger.log(
      `Found ${found.length} credentials for user ${user.email}.`,
    );

    return found;
  }

  async getPassword(
    req: Request,
    getPasswordDTO: GetPasswordDTO,
  ): Promise<string> {
    const user = await this.authService.getUserProfile(req);

    this.logger.debug(
      `Attempting to pull password information for user ${user.email}, host ${getPasswordDTO.host}`,
    );

    const found: CredentialsEntity = await this.repository.findOneBy({
      user_id: user._id,
      host: getPasswordDTO.host,
      login: getPasswordDTO.login,
      deleted: false,
    });

    if (!found)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    this.logger.log(
      `Found credentials for user ${user.email}, host ${getPasswordDTO.host}.`,
    );
    return found.password;
  }

  async remove(
    req: Request,
    deleteCredentialsDTO: DeleteCredentialsDTO,
  ): Promise<ResponseDTO> {
    const user = await this.authService.getUserProfile(req);

    this.logger.debug(
      `Deleting credentials for user ${user.email}, host ${deleteCredentialsDTO.host}`,
    );

    const existingCredentials: CredentialsEntity =
      await this.repository.findOneBy({
        user_id: user._id,
        host: deleteCredentialsDTO.host,
        login: deleteCredentialsDTO.login,
        deleted: false,
      });

    if (!existingCredentials)
      throw new BadRequestException(
        `No such credentials for user ${user.email}`,
      );

    if (deleteCredentialsDTO.deletion_type === 'hard')
      await this.repository.remove(existingCredentials);
    else {
      Object.assign(existingCredentials, {
        deleted: true,
      });

      await this.repository.save(existingCredentials);
    }

    const message = `Credentials for host ${deleteCredentialsDTO.host} deleted for user ${user.email}`;
    this.logger.debug(message);

    return {
      message,
    } as ResponseDTO;
  }

  async hasAny(req: Request, host: string): Promise<ResponseDTO> {
    const hasAnyCredentials: boolean =
      (await this.getAppDisplayedCredentials(req, host)).length > 0;

    return {
      message: hasAnyCredentials
        ? 'Matching credentials found'
        : `No credentials for host ${host}`,
      data: hasAnyCredentials,
    };
  }

  private async restoreDeleted(
    req: Request,
    restoreCredentialsDTO: RestoreCredentialsDTO,
  ): Promise<ResponseDTO> {
    const user = await this.authService.getUserProfile(req);

    this.logger.debug(
      `Restoring credentials for user ${user.email}, host ${restoreCredentialsDTO.host}`,
    );

    const existingCredentials: CredentialsEntity =
      await this.repository.findOneBy({
        user_id: user._id,
        host: restoreCredentialsDTO.host,
        login: restoreCredentialsDTO.login,
        deleted: true,
      });

    if (!existingCredentials)
      throw new BadRequestException(
        `No such deleted credentials for user ${user.email}`,
      );

    Object.assign(existingCredentials, {
      deleted: false,
    });

    await this.repository.save(existingCredentials);

    const message = `Credentials for host ${restoreCredentialsDTO.host} restored for user ${user.email}`;
    this.logger.debug(message);

    return {
      message,
    } as ResponseDTO;
  }

  private async restoreFromHistory(
    req: Request,
    restoreCredentialsDTO: RestoreCredentialsDTO,
  ): Promise<ResponseDTO> {
    const user = await this.authService.getUserProfile(req);

    this.logger.debug(
      `Restoring credentials for user ${user.email}, host ${restoreCredentialsDTO.host}`,
    );

    const latestFromHistory: HistoryEntity[] = await this.historyService.find({
      where: {
        user_id: user._id,
        host: restoreCredentialsDTO.host,
        login: restoreCredentialsDTO.login,
        deleted: false,
      },
      order: {
        created_at: 'desc',
      },
      take: 1,
    });

    if (!latestFromHistory.length)
      throw new BadRequestException(
        `No such history entity for user ${user.email}`,
      );

    const entityFromCredentials: CredentialsEntity[] =
      await this.repository.find({
        where: {
          user_id: user._id,
          host: restoreCredentialsDTO.host,
          login: restoreCredentialsDTO.login,
          deleted: false,
        },
        order: {
          created_at: 'desc',
        },
        take: 1,
      });

    if (!entityFromCredentials.length)
      throw new BadRequestException(
        `No such credentials entity for user ${user.email}`,
      );

    Object.assign(entityFromCredentials[0], {
      ...latestFromHistory[0],
      _id: entityFromCredentials[0]._id,
    } as CredentialsEntity);

    await this.repository.save(entityFromCredentials[0]);
    await this.historyService.remove(latestFromHistory[0]);

    const message = `Credentials for host ${restoreCredentialsDTO.host} restored from history for user ${user.email}`;
    this.logger.debug(message);

    return {
      message,
    } as ResponseDTO;
  }

  async restore(
    req: Request,
    restoreCredentialsDTO: RestoreCredentialsDTO,
  ): Promise<ResponseDTO> {
    if (!restoreCredentialsDTO.from_history)
      return this.restoreDeleted(req, restoreCredentialsDTO);

    return this.restoreFromHistory(req, restoreCredentialsDTO);
  }
}
