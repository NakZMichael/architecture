import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import {Item} from './item';
import {Store} from './store';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id?:number;

  @ManyToMany((type) => Item)
  @JoinTable()
  items!:Item[];

  @ManyToOne((type) => Store, {
    cascade: false,
  })
  @JoinTable()
  store!:Store;

  @Column()
  isCanceled!:boolean;

  @Column()
  cash!:number;

  @Column()
  subtotal!:number;

  @Column()
  tax!:number;

  @CreateDateColumn({name: 'created_at', type: 'timestamp', precision: 0})
  readonly createdAt?: Date;
}
