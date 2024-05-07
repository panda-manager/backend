import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ResponseDTO {
  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: 'The message of the error response',
  })
  readonly message: string;

  @ApiProperty({
    example: 'abcdef/{ data: 123 }',
    description: 'Data, if there is any',
  })
  readonly data: object[] | string | object | number;
  @IsOptional()
  @ApiProperty({
    example: '1724654565771',
    description: 'The epoch representation of the error response timestamp',
  })
  readonly timestamp: number;
}
