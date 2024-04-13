import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly _id: string;

  @ApiProperty({ type: String, example: 'some_email_address@doesnt.matter.il '})
  readonly email: string;

  @ApiProperty({ type: [String], example: '[ "121.100.67.6" ]' })
  readonly devices: string[];
}
