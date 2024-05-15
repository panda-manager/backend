import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ResponseDTO {
  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: 'The message of the error response',
  })
  @IsOptional()
  readonly message?: string;

  @ApiProperty({
    example: 'abcdef/{ data: 123 }',
    description: 'Data, if there is any',
  })
  @IsOptional()
  readonly data?: object[] | string | object | number | boolean;

  @ApiProperty({
    example: '1724654565771',
    description: 'The epoch representation of the error response timestamp',
  })
  @IsOptional()
  readonly timestamp?: number;
}
