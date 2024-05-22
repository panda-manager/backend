import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Exclude } from 'class-transformer';

@Entity({ name: 'credentials' })
export class CredentialsEntity {
  @ApiProperty({ type: String, description: "Credentials' ObjectId" })
  @ObjectIdColumn()
  @Exclude()
  _id: ObjectId;

  @Column()
  @Exclude({ toPlainOnly: true })
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

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: Boolean, default: false })
  deleted: boolean;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn()
  created_at: Date;

  constructor(partial: Partial<CredentialsEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
