import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create_user.dto';
import { UserStatus } from './enum/user_status';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private user_repository: Repository<UserEntity>,
  ) {}

  findOneBy(where: any) {
    return this.user_repository.findOneBy(where);
  }

  insert(req: Request, create_dto: CreateUserDTO) {
    return this.user_repository.save({
      ...create_dto,
      devices: [
        { identifier: req.hostname, status: UserStatus.PENDING_VERIFICATION },
      ],
    });
  }

  set_device_as_verified(user: UserEntity, device: string) {
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

    return this.user_repository.save(user);
  }
}
