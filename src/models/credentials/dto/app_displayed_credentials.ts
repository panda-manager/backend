import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
export class AppDisplayedCredentialsDTO {
  @ApiProperty({ description: 'Credentials ObjectId' })
  readonly _id: ObjectId;

  @ApiProperty({ type: String, example: 'Facebook' })
  readonly display_name: string;

  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  readonly login: string;
}
