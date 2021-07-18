import {Item} from '../../enterprise-rules';
import {IItemRepository} from '../repositories';

export interface CreateItemRequest{
  name:string,
  price:number
}

export interface CreateItemProps{
  repository:IItemRepository
}

export class CreateItem {
  repository:IItemRepository

  constructor(props:CreateItemProps) {
    this.repository = props.repository;
  }

  execute = async (req:CreateItemRequest)=>{
    const item = await this.repository.insert(new Item({
      name: req.name,
      price: req.price,
    }));
    return item;
  }
}
