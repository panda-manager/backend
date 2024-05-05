import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ type: String, example: 'John' })
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({ type: String, example: 'Johnson' })
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({ type: String, example: 'some_email_address@doesnt.matter.il' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly master_password: string;
}
