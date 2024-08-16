import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { HistoryEntity } from './entity/history.entity';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectRepository(HistoryEntity)
    private repository: Repository<HistoryEntity>,
  ) {}

  async insert(entity: HistoryEntity): Promise<void> {
    this.logger.log(
      `Saving previous credentials for user ${entity.user_id}, host ${entity.host}, login ${entity.login}`,
    );

    await this.repository.save(entity);

    this.logger.log(
      `Previous credentials for user ${entity.user_id}, host ${entity.host}, login ${entity.login} saved successfully.`,
    );
  }

  findOneBy(where: FindOptionsWhere<HistoryEntity>): Promise<HistoryEntity> {
    return this.repository.findOneBy(where);
  }

  find(options: FindManyOptions<HistoryEntity>): Promise<HistoryEntity[]> {
    return this.repository.find(options);
  }

  async latest(where: FindOptionsWhere<HistoryEntity>) {
    const latestDocument: HistoryEntity[] = await this.find({
      where,
      order: {
        created_at: 'desc',
      },
      take: 1,
    });

    if (!latestDocument.length) return null;
    return latestDocument[0];
  }
}
