import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OTPVerifyDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, example: 'somestringsentinmail' })
  @IsString()
  @IsNotEmpty()
  readonly otp: string;
}
