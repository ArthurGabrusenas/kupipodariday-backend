import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ type: [Number], name: 'itemsId' })
  @IsOptional()
  @IsArray()
  itemsId?: number[];
}
