import { ApiProperty } from '@nestjs/swagger';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { WishPartialDto } from '../../wishes/dto/wish-partial.dto';

export class WishlistDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ type: String, minLength: 0, maxLength: 250 })
  name: string;

  @ApiProperty({ type: String })
  image: string;

  @ApiProperty({ type: UserPublicProfileResponseDto })
  owner: UserPublicProfileResponseDto;

  @ApiProperty({ type: [WishPartialDto] })
  items: WishPartialDto[];
}
