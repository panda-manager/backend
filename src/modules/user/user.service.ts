import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create_user.dto';
import { UserStatus } from './enum/user_status';
import device_identifier from './device_identifier';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private user_repository: Repository<UserEntity>,
  ) {}

  findOneBy(where: any) {
    return this.user_repository.findOneBy(where);
  }

  async insert(req: Request, create_dto: CreateUserDTO) {
    await this.user_repository.save({
      ...create_dto,
      devices: [
        {
          identifier: req[device_identifier],
          status: UserStatus.PENDING_VERIFICATION,
        },
      ],
    });

    const message = `User ${create_dto.email} inserted to DB`;
    this.logger.log(message);

    return {
      message,
    };
  }

  async set_device_as_verified(user: UserEntity, device: string) {
    Object.assign(user, {
      status: UserStatus.VERIFIED,
    });

    const device_to_update = user.devices.find(
      (item) => item.identifier === device,
    );

    if (device_to_update) {
      Object.assign(device_to_update, {
        status: UserStatus.VERIFIED,
      });
    }

    await this.user_repository.save(user);

    const message = `User ${user.email} has verified device ${device}`;
    this.logger.log(message);

    return {
      message,
    };
  }
}
