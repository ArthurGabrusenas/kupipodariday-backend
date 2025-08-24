import { ApiProperty } from '@nestjs/swagger';

export class SigninUserResponseDto {
  @ApiProperty({ description: 'JWT-токен' })
  access_token: string;
}
