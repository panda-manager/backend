import { Entity } from 'typeorm';
import { CredentialsEntity } from '../../credentials/entity/credentials.entity';

@Entity({ name: 'history' })
export class HistoryEntity extends CredentialsEntity {}
