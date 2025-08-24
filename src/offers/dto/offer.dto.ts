import { ApiProperty } from '@nestjs/swagger';
import { WishDto } from '../../wishes/dto/wish.dto';
import { UserProfileResponseDto } from '../../users/dto/user-profile-response.dto';

export class OfferDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ type: () => WishDto })
  item: WishDto;

  @ApiProperty({ type: Number, minimum: 1 })
  amount: number;

  @ApiProperty({ type: Boolean })
  hidden: boolean;

  @ApiProperty({ type: () => UserProfileResponseDto })
  user: UserProfileResponseDto;
}
