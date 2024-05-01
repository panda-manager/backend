import { ApiProperty } from '@nestjs/swagger';

export class UpdateCredentialsDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  readonly login: string;

  @ApiProperty({ type: String, example: 'Facebook' })
  readonly new_display_name: string;

  @ApiProperty({ type: String, example: 'new_username' })
  readonly new_login: string;

  @ApiProperty({ type: String, description: 'Encrypted password' })
  readonly new_password: string;
}
