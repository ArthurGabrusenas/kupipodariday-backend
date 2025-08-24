import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
  DataSource,
} from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  private readonly wishesRepository: Repository<Wish>;

  constructor(dataSource: DataSource) {
    this.wishesRepository = dataSource.getRepository(Wish);
  }

  create(data: DeepPartial<Wish>) {
    const entity = this.wishesRepository.create(data);
    return this.wishesRepository.save(entity);
  }

  findOne(where: FindOneOptions<Wish>['where']) {
    return this.wishesRepository.findOne({
      where,
      relations: ['owner', 'offers'],
    });
  }

  findMany(options?: FindManyOptions<Wish>) {
    const withRelations: FindManyOptions<Wish> = {
      ...options,
    };
    if (!withRelations.relations) {
      withRelations.relations = ['owner', 'offers'];
    }
    return this.wishesRepository.find(withRelations);
  }

  async updateOne(
    where: FindOneOptions<Wish>['where'],
    data: DeepPartial<Wish>,
  ) {
    const entity = await this.wishesRepository.findOneOrFail({
      where,
      relations: ['offers'],
    });
    if (entity.offers && entity.offers.length > 0 && data.price) {
      throw new BadRequestException(
        'Нельзя менять стоимость, если уже есть заявки',
      );
    }
    Object.assign(entity, data);
    return this.wishesRepository.save(entity);
  }

  async removeOne(where: FindOneOptions<Wish>['where']) {
    const entity = await this.wishesRepository.findOneOrFail({
      where,
      relations: ['owner', 'offers'],
    });
    return this.wishesRepository.remove(entity);
  }
}
