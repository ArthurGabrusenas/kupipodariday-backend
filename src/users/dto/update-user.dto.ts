import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ minLength: 1, maxLength: 64, example: 'exampleuser' })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 200)
  about?: string;

  @ApiPropertyOptional({ example: 'https://i.pravatar.cc/150?img=3' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({ example: 'user@yandex.ru' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ minLength: 2, example: 'somestrongpassword' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  password?: string;
}
