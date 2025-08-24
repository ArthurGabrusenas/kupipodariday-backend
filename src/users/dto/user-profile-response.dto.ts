import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({ type: Number, example: 5 })
  id: number;

  @ApiProperty({ type: String, minLength: 1, maxLength: 64, example: 'user' })
  username: string;

  @ApiProperty({
    type: String,
    minLength: 0,
    maxLength: 200,
    example: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @ApiProperty({ type: String, example: 'https://i.pravatar.cc/300' })
  avatar: string;

  @ApiProperty({ type: String, example: 'user@yandex.ru' })
  email: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string;
}
