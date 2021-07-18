import {Item} from './item';
import {Store} from './store';

export interface OrderProps{
  id?:number|string
  items:Item[]
  store:Store
  isCanceled:boolean
  cash:number
  createdAt?:Date
}

export class Order {
  id?:number|string
  customer?:string
  items:Item[]
  store:Store
  isCanceled:boolean
  cash:number
  createdAt?:Date

  static taxRate:number = 0.08

  constructor(params:OrderProps) {
    this.id = params.id;
    this.items = params.items;
    this.store = params.store;
    this.isCanceled = params.isCanceled;
    this.createdAt = params.createdAt;
    this.cash = params.cash;
  }

  getSubtotal = ():number=>{
    return this.items.reduce((prevPrice, currentItem)=>{
      return prevPrice +currentItem.price;
    }, 0);
  }
  getTotal = ():number =>{
    return this.getSubtotal() + this.getTax();
  }
  getTax = ():number =>{
    return Math.floor(this.getSubtotal() * Order.taxRate );
  }

  getChange = ():number => {
    return this.cash - this.getTotal();
  }
}
