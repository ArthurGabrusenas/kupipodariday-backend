import { ConflictException, Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  Like,
  Repository,
  DataSource,
} from 'typeorm';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor(dataSource: DataSource, private readonly hasher: HashService) {
    this.usersRepository = dataSource.getRepository(User);
  }

  create(data: Partial<User>) {
    const entity = this.usersRepository.create(data);
    return this.usersRepository.save(entity);
  }

  findOne(where: FindOneOptions<User>['where']) {
    return this.usersRepository.findOne({ where });
  }

  findOneOrFail(where: FindOneOptions<User>['where']) {
    return this.usersRepository.findOneOrFail({ where });
  }

  findMany(query: { search?: string }) {
    const { search } = query;
    if (!search) return this.usersRepository.find();
    return this.usersRepository.find({
      where: [
        { username: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
      ],
    } as FindManyOptions<User>);
  }

  updateOne(where: FindOneOptions<User>['where'], data: Partial<User>) {
    return this.usersRepository
      .findOneOrFail({ where })
      .then((entity) => Object.assign(entity, data))
      .then((entity) => this.usersRepository.save(entity));
  }

  removeOne(where: FindOneOptions<User>['where']) {
    return this.usersRepository
      .findOneOrFail({ where })
      .then((entity) => this.usersRepository.remove(entity));
  }

  async findPublicByUsername(username: string) {
    const user = await this.usersRepository.findOneOrFail({
      where: { username },
    });
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as const;
  }

  getWishesByUserId(userId: number) {
    return this.usersRepository
      .findOneOrFail({
        where: { id: userId },
        relations: [
          'wishes',
          'wishes.owner',
          'wishes.offers',
          'wishes.offers.user',
        ],
      })
      .then((u) => u.wishes);
  }

  getWishesByUsername(username: string) {
    return this.usersRepository
      .findOneOrFail({
        where: { username },
        relations: [
          'wishes',
          'wishes.owner',
          'wishes.offers',
          'wishes.offers.user',
        ],
      })
      .then((u) => u.wishes);
  }

  findByEmailOrUsername(email: string, username: string) {
    return this.usersRepository.findOne({ where: [{ email }, { username }] });
  }

  async updateProfileWithHashing(userId: number, data: Partial<User>) {
    const entity = await this.usersRepository.findOneOrFail({
      where: { id: userId },
    });
    if (data.password) {
      entity.password = await this.hasher.hash(data.password);
      const { password, ...rest } = data;
      data = rest;
    }
    if (data.email || data.username) {
      const whereClauses: Array<Partial<User>> = [];
      if (data.email) whereClauses.push({ email: data.email });
      if (data.username) whereClauses.push({ username: data.username });
      const existing = await this.usersRepository.findOne({
        where: whereClauses,
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }
    Object.assign(entity, data);
    return this.usersRepository.save(entity);
  }
}
