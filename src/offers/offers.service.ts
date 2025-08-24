import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  private readonly offersRepository: Repository<Offer>;

  constructor(
    dataSource: DataSource,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {
    this.offersRepository = dataSource.getRepository(Offer);
  }

  async create(data: {
    userId: number;
    itemId: number;
    amount: number;
    hidden?: boolean;
  }) {
    const wish = await this.wishesService.findOne({ id: data.itemId });
    const user = await this.usersService.findOne({ id: data.userId });
    if (!wish || !user) throw new BadRequestException('Некорректные данные');
    if (wish.owner?.id === user.id)
      throw new ForbiddenException('Нельзя скидываться на свой подарок');

    const price = Number(wish.price);
    const raised = Number(wish.raised);
    const nextRaised = Number((raised + data.amount).toFixed(2));
    if (nextRaised > price) {
      throw new BadRequestException('Сумма заявок превышает стоимость подарка');
    }

    const offer = this.offersRepository.create({
      amount: Number(data.amount.toFixed(2)),
      hidden: !!data.hidden,
      item: wish,
      user,
    });
    await this.offersRepository.save(offer);

    await this.wishesService.updateOne(
      { id: wish.id },
      { raised: nextRaised as unknown as number },
    );

    return offer;
  }

  findAll() {
    return this.offersRepository.find();
  }

  findOne(id: number) {
    return this.offersRepository.findOneOrFail({ where: { id } });
  }
}
