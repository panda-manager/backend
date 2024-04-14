import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';

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

  @Column()
  @Exclude()
  master_password: string;

  @ApiProperty({ type: [String], example: '[ "121.100.67.6" ]' })
  @Column()
  devices: string[];

  @ApiProperty({ type: Number, description: 'User creation UTC epoch' })
  created_at: number;
}
