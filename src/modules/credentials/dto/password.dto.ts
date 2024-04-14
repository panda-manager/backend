import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PasswordDTO {
  @ApiProperty({ description: 'Credentials ObjectId' })
  @IsNotEmpty()
  readonly _id: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly password: string;
}
