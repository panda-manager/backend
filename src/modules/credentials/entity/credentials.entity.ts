import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Credentials {
  @PrimaryGeneratedColumn()
  _id: string;

  @Column()
  user_id: string;

  @Column()
  host: string;

  @Column()
  login: string;

  @Column()
  password: string;
}
