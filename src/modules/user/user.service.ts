import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create_user.dto';
import { UserStatus } from './enum/user_status';
import { ResponseDTO } from '../../common';
import { getDeviceIdentifier } from './device_identifier';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  findOneBy(where: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return this.repository.findOneBy(where);
  }

  async insert(
    req: Request,
    createUserDTO: CreateUserDTO,
  ): Promise<ResponseDTO> {
    await this.repository.save({
      ...createUserDTO,
      devices: [
        {
          identifier: getDeviceIdentifier(req),
          status: UserStatus.PENDING_VERIFICATION,
        },
      ],
    });

    const message = `User ${createUserDTO.email} inserted to DB`;
    this.logger.log(message);

    return { message };
  }

  async setDeviceVerified(
    user: UserEntity,
    device: string,
  ): Promise<ResponseDTO> {
    Object.assign(user, {
      status: UserStatus.VERIFIED,
    });

    const deviceToUpdate = user.devices.find(
      (item) => item.identifier === device,
    );

    if (deviceToUpdate) {
      Object.assign(deviceToUpdate, {
        status: UserStatus.VERIFIED,
      });
    }

    await this.repository.save(user);

    const message = `User ${user.email} has verified device ${device}`;
    this.logger.log(message);

    return { message };
  }

  async addDevice(user: UserEntity, identifier: string): Promise<ResponseDTO> {
    Object.assign(user, {
      devices: [
        ...user.devices,
        {
          identifier,
          status: UserStatus.PENDING_VERIFICATION,
        },
      ],
    });

    await this.repository.save(user);

    return {
      message: `New device added for user ${user.email}, identifier: ${identifier}`,
    };
  }

  async validateMasterPassword(
    req: Request,
    masterPassword: string,
  ): Promise<ResponseDTO> {
    const user = await this.authService.getUserProfile(req);

    if (user.master_password !== masterPassword)
      throw new ForbiddenException('Password is incorrect');

    return {
      message: 'Validation succeeded!',
    };
  }
}
