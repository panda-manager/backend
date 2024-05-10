import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateMasterDTO {
  @ApiProperty({ type: String, example: 'mypass' })
  @IsNotEmpty()
  readonly master_password: string;
}
