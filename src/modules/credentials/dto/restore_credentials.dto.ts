import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RestoreCredentialsDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsNotEmpty()
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ type: String })
  readonly id_from_history?: string;
}
