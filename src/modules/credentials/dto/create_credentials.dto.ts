import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCredentialsDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsNotEmpty()
  readonly host: string;

  @ApiProperty({ type: String, example: 'Facebook' })
  @IsNotEmpty()
  readonly display_name: string;

  @ApiProperty({ type: String, example: 'username' })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ type: String, description: 'Encrypted password' })
  @IsNotEmpty()
  readonly password: string;
}
