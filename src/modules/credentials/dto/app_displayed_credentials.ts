import { ApiProperty } from '@nestjs/swagger';

export class AppDisplayedCredentialsDTO {
  @ApiProperty({ description: 'Credentials ObjectId' })
  readonly _id: string;

  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  readonly login: string;
}