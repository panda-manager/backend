import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ErrorResponseDTO {
  @ApiProperty({
    example: '40x',
    description: 'The status code of the error response'
  })
  @IsNotEmpty()
  readonly status: string

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: 'The message of the error response'
  })
  @IsNotEmpty()
  readonly message: string

  @ApiProperty({
    example: '1724654565771',
    description: 'The epoch representation of the error response timestamp'
  })
  @IsNotEmpty()
  readonly timestamp: number

  @ApiProperty({
    example: '/v1',
    description: 'The path of the error response'
  })
  @IsNotEmpty()
  readonly path: string
}