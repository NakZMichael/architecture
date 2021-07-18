import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id?:number;

  @Column()
  name!:string;

  @Column()
  price!:number;
}
