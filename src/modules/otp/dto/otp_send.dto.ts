import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class OTPSendDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
