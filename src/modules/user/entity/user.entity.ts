import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { uuidv4 } from '../../../utils/uuid';

@Entity()
export class User {
  @ApiProperty({ description: "User's ObjectId" })
  @PrimaryGeneratedColumn()
  _id: string;

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

  @ApiProperty({ type: [String], example: '[ "121.100.67.6" ]' })
  @Column()
  devices: string[];

  @ApiProperty({ type: Number, description: 'User creation UTC epoch' })
  @Column()
  created_at: number;

  constructor(partial: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
      this._id = this._id || uuidv4();
      this.created_at = this.created_at || +new Date();
    }
  }
}
