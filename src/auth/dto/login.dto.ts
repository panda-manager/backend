import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  readonly email: string;

  @ApiProperty({ type: String, example: 'mypass' })
  readonly master_password: string;
}
