import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class BasicAuthLoginDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, example: 'mypass' })
  @IsNotEmpty()
  readonly master_password: string;
}
