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
import { DeviceStatus } from './enum/device_status';
import { getDeviceIdentifier, ResponseDTO } from '../../common';
import { AuthService } from '../auth/auth.service';

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
          status: DeviceStatus.PENDING_VERIFICATION,
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
      status: DeviceStatus.VERIFIED,
    });

    const deviceToUpdate = user.devices.find(
      (item) => item.identifier === device,
    );

    if (deviceToUpdate) {
      Object.assign(deviceToUpdate, {
        status: DeviceStatus.VERIFIED,
      });
    }

    await this.repository.save(user);

    const message = `User ${user.email} has verified device ${device}`;
    this.logger.log(message);

    return { message };
  }

  async addDevice(user: UserEntity, identifier: string): Promise<ResponseDTO> {
    if (!user.devices.find((item) => item.identifier == identifier)) {
      Object.assign(user, {
        devices: [
          ...user.devices,
          {
            identifier,
            status: DeviceStatus.PENDING_VERIFICATION,
          },
        ],
      });

      await this.repository.save(user);

      return {
        message: `New device added for user ${user.email}, identifier: ${identifier}`,
      };
    }

    return {
      message: `Device ${identifier} already exists for user ${user.email}`,
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
