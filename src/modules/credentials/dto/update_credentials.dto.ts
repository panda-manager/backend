import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCredentialsDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsNotEmpty()
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ type: String, example: 'Facebook' })
  readonly new_display_name?: string;

  @ApiProperty({ type: String, example: 'new_username' })
  readonly new_login?: string;

  @ApiProperty({ type: String, description: 'Encrypted password' })
  @IsNotEmpty()
  readonly new_password: string;
}
