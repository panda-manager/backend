import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteCredentialsDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsNotEmpty()
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ type: String, example: 'soft' })
  readonly deletion_type?: 'soft' | 'hard';
}
