import { ApiProperty } from '@nestjs/swagger';

export class WishPartialDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ type: String, minLength: 1, maxLength: 250 })
  name: string;

  @ApiProperty({ type: String })
  link: string;

  @ApiProperty({ type: String })
  image: string;

  @ApiProperty({ type: Number, minimum: 1 })
  price: number;

  @ApiProperty({ type: Number, minimum: 1 })
  raised: number;

  @ApiProperty({ type: Number })
  copied: number;

  @ApiProperty({ type: String, minLength: 1, maxLength: 1024 })
  description: string;
}
