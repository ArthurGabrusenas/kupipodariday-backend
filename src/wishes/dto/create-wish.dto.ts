import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @ApiProperty()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsUrl()
  image: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsString()
  @Length(1, 1024)
  description: string;
}
