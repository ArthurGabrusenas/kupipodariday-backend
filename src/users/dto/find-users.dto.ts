import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindUsersDto {
  @ApiProperty({ example: 'some@ya.ru', description: 'username или email' })
  @IsString()
  query: string;
}
