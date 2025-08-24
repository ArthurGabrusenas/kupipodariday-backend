import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ length: 250 })
  name: string;

  @Column({ type: 'varchar', length: 1500, nullable: true, default: '' })
  description: string;

  @Column({ type: 'text' })
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable({ name: 'wishlist_items' })
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, { eager: true })
  owner: User;
}
