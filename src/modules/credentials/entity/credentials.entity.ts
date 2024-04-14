import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { uuidv4 } from '../../../utils/uuid';

@Entity()
export class Credentials {
  @ApiProperty({ type: String, description: "Credentials' ObjectId" })
  @PrimaryGeneratedColumn()
  _id: string;

  @Exclude()
  @Column()
  user_id: string;

  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @Column()
  host: string;

  @ApiProperty({ type: String, example: 'username' })
  @Column()
  login: string;

  @ApiProperty({ type: String, description: 'Encrypted password' })
  @Column()
  password: string;

  @ApiProperty({ type: Number, description: 'User creation UTC epoch' })
  @Column()
  created_at: number;

  constructor(partial: Partial<Credentials>) {
    if (partial) {
      Object.assign(this, partial);
      this._id = this._id || uuidv4();
      this.created_at = this.created_at || +new Date();
    }
  }
}
