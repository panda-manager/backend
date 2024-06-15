import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntity } from './entity/history.entity';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectRepository(HistoryEntity)
    private history_repository: Repository<HistoryEntity>,
  ) {}

  async insert(entity: HistoryEntity): Promise<void> {
    this.logger.log(
      `Saving previous credentials for user ${entity.user_id}, host ${entity.host}, login ${entity.login}`,
    );

    await this.history_repository.save(entity);

    this.logger.log(
      `Previous credentials for user ${entity.user_id}, host ${entity.host}, login ${entity.login} saved successfully.`,
    );
  }
}
