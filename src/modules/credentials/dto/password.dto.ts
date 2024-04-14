import { ApiProperty } from '@nestjs/swagger';

export class PasswordDTO {
  @ApiProperty({ type: String })
  readonly password: string;
}
