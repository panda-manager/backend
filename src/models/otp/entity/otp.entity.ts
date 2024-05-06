import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Exclude } from 'class-transformer';

@Entity({ name: 'otp' })
export class OTPEntity {
  @ApiProperty({ type: String, description: 'OTP ObjectId' })
  @ObjectIdColumn()
  readonly _id: ObjectId;

  @ApiProperty({ type: ObjectId, description: "User's ObjectId" })
  @Column()
  @Exclude()
  readonly user_id: ObjectId;

  @ApiProperty({ type: String, description: 'OTP Code' })
  @Column()
  readonly otp: string;

  @ApiProperty({ type: Date, description: 'Created at' })
  @CreateDateColumn()
  readonly created_at: Date;

  constructor(partial: Partial<OTPEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
