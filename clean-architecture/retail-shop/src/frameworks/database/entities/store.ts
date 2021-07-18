import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id?:number;

  @Column()
  name!:string;

  @Column()
  phoneNumber!:string;
}
