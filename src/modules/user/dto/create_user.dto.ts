import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ type: String, example: 'John' })
  readonly first_name: string;

  @ApiProperty({ type: String, example: 'Johnson' })
  readonly last_name: string;

  @ApiProperty({ type: String, example: 'some_email_address@doesnt.matter.il' })
  readonly email: string;

  @ApiProperty({ type: String })
  readonly master_password: string;
}
