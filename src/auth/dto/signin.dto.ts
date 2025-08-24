import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SigninDto {
  @ApiProperty()
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(6, 100)
  password: string;
}
