import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '../enum/device_status';
import { Column } from 'typeorm';

export class DeviceDTO {
  @ApiProperty({ type: String, description: 'IP(/MAC?)' })
  readonly identifier: string;

  @ApiProperty({ type: Number, description: 'Pending verification/verified' })
  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.PENDING_VERIFICATION,
  })
  readonly status: DeviceStatus;
}
