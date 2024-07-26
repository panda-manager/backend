import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyDeviceDTO {
  @ApiProperty({ type: String, example: 'that@doesnt.matter.il ' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'that@doesnt.matter.il ' })
  device: string;
}
