import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create_user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findOneBy(where: any) {
    return this.usersRepository.findOneBy(where);
  }

  async insert(req: Request, create_dto: CreateUserDTO) {
    return await this.usersRepository.save({
      ...create_dto,
    });
  }
}
