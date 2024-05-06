import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPasswordDTO {
  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsNotEmpty()
  @IsString()
  readonly host: string;

  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  @IsNotEmpty()
  @IsString()
  readonly login: string;
}
