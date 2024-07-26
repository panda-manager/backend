import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddDeviceDTO {
  @ApiProperty({ type: String, example: 'some_email_address@doesnt.matter.il' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    type: String,
    example: '127.0.0.1',
    description: 'Device identifier',
  })
  @IsNotEmpty()
  readonly device: string;
}
