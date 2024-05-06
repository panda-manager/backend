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
      devices: [req.hostname],
      status: UserStatus.PENDING_VERIFICATION,
    });
  }

  update_user_verified(user: UserEntity) {
    Object.assign(user, {
      status: UserStatus.VERIFIED,
    });

    return this.user_repository.save(user);
  }
}
