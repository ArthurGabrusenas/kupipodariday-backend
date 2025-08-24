import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  DataSource,
} from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { In } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  private readonly wishlistsRepository: Repository<Wishlist>;

  constructor(dataSource: DataSource) {
    this.wishlistsRepository = dataSource.getRepository(Wishlist);
  }

  create(data: Partial<Wishlist>) {
    const entity = this.wishlistsRepository.create(data);
    return this.wishlistsRepository.save(entity);
  }

  async createFromDto(dto: CreateWishlistDto, ownerId?: number) {
    const items = dto.itemsId?.length
      ? await this.wishlistsRepository.manager.find(Wish, {
          where: { id: In(dto.itemsId) },
        })
      : [];
    const owner = ownerId ? ({ id: ownerId } as User) : undefined;
    return this.create({ name: dto.name, image: dto.image, items, owner });
  }

  findOne(where: FindOneOptions<Wishlist>['where']) {
    return this.wishlistsRepository.findOne({
      where,
      relations: ['items', 'owner'],
    });
  }

  findMany(options?: FindManyOptions<Wishlist>) {
    return this.wishlistsRepository.find({
      ...options,
      relations: ['items', 'owner'],
    });
  }

  async updateOne(
    where: FindOneOptions<Wishlist>['where'],
    data: Partial<Wishlist>,
  ) {
    const entity = await this.wishlistsRepository.findOneOrFail({ where });
    Object.assign(entity, data);
    return this.wishlistsRepository.save(entity);
  }

  async updateFromDto(id: number, dto: UpdateWishlistDto) {
    const data: Partial<Wishlist> = { name: dto.name, image: dto.image };
    if (dto.itemsId) {
      data.items = await this.wishlistsRepository.manager.find(Wish, {
        where: { id: In(dto.itemsId) },
      });
    }
    return this.updateOne({ id }, data);
  }

  async removeOne(where: FindOneOptions<Wishlist>['where']) {
    const entity = await this.wishlistsRepository.findOneOrFail({
      where,
      relations: ['items', 'owner'],
    });
    return this.wishlistsRepository.remove(entity);
  }

  async findOneWithRelations(where: FindOneOptions<Wishlist>['where']) {
    return this.wishlistsRepository.findOneOrFail({
      where,
      relations: ['items', 'owner'],
    });
  }
}
