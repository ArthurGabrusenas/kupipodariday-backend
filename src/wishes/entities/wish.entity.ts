import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity('wishes')
export class Wish {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @Column({ length: 250 })
  name!: string;

  @Column({ type: 'text' })
  link!: string;

  @Column({ type: 'text' })
  image!: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  price!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  raised!: number;

  @ManyToOne(() => User, (user) => user.wishes, { eager: true })
  owner!: User;

  @Column({ type: 'varchar', length: 1024 })
  description!: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers!: Offer[];

  @Column({ type: 'int', default: 0 })
  copied!: number;
}
