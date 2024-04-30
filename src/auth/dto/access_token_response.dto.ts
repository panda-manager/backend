import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponseDTO {
  @ApiProperty({ type: String })
  readonly access_token: string;
}
