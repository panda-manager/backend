import { ApiProperty } from '@nestjs/swagger';

export class DeleteCredentialsDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  readonly login: string;
}
