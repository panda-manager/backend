import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ type: String, example: 'John' })
  first_name: string;

  @ApiProperty({ type: String, example: 'Johnson' })
  last_name: string;

  @ApiProperty({ type: String, example: 'some_email_address@doesnt.matter.il' })
  email: string;

  @ApiProperty({ type: String })
  master_password: string;
}
