import { ApiProperty } from '@nestjs/swagger';

export class DeviceDTO {
  @ApiProperty({ type: String, description: 'IP(/MAC?)' })
  readonly identifier: string;

  @ApiProperty({
    type: Number,
    description: 'Device addition timestamp (epoch)',
  })
  readonly created_at: number;

  @ApiProperty({ type: Number, description: 'Last activity timestamp (epoch)' })
  readonly last_activity: number;
}
