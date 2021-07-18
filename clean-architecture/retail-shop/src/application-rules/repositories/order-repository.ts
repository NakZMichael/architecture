import {Order} from '../../enterprise-rules/models/order';

export interface IOrderRepository{
  insert(order:Order):Promise<Order>
  find(id:number|string):Promise<Order>
  findAll():Promise<Order[]>
  delete(id:number|string):Promise<boolean>
}
