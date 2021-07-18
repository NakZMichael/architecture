import {Item} from '../../enterprise-rules/models/item';

export interface IItemRepository{
  insert(item:Item):Promise<Item>
  find(id:number|string):Promise<Item>
  findAll():Promise<Item[]>
}
