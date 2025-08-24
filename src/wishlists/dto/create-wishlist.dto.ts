import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description?: string;

  @ApiProperty()
  @IsUrl()
  image: string;

  @ApiProperty({ type: [Number], name: 'itemsId' })
  @IsArray()
  itemsId: number[];
}
