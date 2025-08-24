import { ApiProperty } from '@nestjs/swagger';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { OfferDto } from '../../offers/dto/offer.dto';

export class WishDto {
  @ApiProperty({ type: Number })
  id!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;

  @ApiProperty({ type: String, minLength: 1, maxLength: 250 })
  name!: string;

  @ApiProperty({ type: String })
  link!: string;

  @ApiProperty({ type: String })
  image!: string;

  @ApiProperty({ type: Number, minimum: 1 })
  price!: number;

  @ApiProperty({ type: Number, minimum: 1 })
  raised!: number;

  @ApiProperty({ type: Number })
  copied!: number;

  @ApiProperty({ type: String, minLength: 1, maxLength: 1024 })
  description!: string;

  @ApiProperty({ type: UserPublicProfileResponseDto })
  owner!: UserPublicProfileResponseDto;

  @ApiProperty({ type: [OfferDto] })
  offers!: OfferDto[];
}
