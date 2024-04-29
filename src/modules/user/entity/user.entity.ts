import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ description: "User's ObjectId" })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({ type: String, example: 'John' })
  @Column()
  first_name: string;

  @ApiProperty({ type: String, example: 'Johnson' })
  @Column()
  last_name: string;

  @ApiProperty({ type: String, example: 'that@doesnt.matter.il ' })
  @Column()
  email: string;

  @Exclude()
  @Column()
  master_password: string;

  @ApiProperty({ type: [String] })
  @Column()
  devices: string[];

  @ApiProperty({ type: Number, description: 'User creation UTC epoch' })
  @CreateDateColumn()
  created_at: Date;

  constructor(partial: Partial<UserEntity>) {
    if (partial) {
      Object.assign(this, partial);
      //TODO: Implement on controller -> this.devices.push(ReqHost)
    }
  }
}
