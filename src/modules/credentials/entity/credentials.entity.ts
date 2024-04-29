import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ObjectId } from 'mongodb';

@Entity({ name: 'credentials' })
export class CredentialsEntity {
  @ApiProperty({ type: String, description: "Credentials' ObjectId" })
  @ObjectIdColumn()
  _id: ObjectId;

  @Exclude()
  @Column()
  user_id: ObjectId;

  @ApiProperty({ type: String, example: 'Facebook' })
  @Column()
  display_name: string;

  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @Column()
  host: string;

  @ApiProperty({ type: String, example: 'username' })
  @Column()
  login: string;

  @ApiProperty({ type: String, description: 'Encrypted password' })
  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  constructor(partial: Partial<CredentialsEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
