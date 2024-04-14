import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Credentials {
  @ApiProperty({ type: String, description: "Credentials' ObjectId" })
  @PrimaryGeneratedColumn()
  _id: string;

  @Column()
  @Exclude()
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
}
