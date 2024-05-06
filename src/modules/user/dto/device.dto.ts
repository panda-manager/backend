import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../enum/user_status';
import { Column } from 'typeorm';

export class DeviceDTO {
  @ApiProperty({ type: String, description: 'IP(/MAC?)' })
  readonly identifier: string;

  @ApiProperty({ type: Number, description: 'Pending verification/verified' })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  readonly status: UserStatus;
}
