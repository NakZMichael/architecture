import {Connection, getConnection, getRepository, Repository} from 'typeorm';
import {IItemRepository} from '../../../application-rules/repositories';
import {Item} from '../entities/item';
import {Item as ItemModel} from '../../../enterprise-rules';

export class ItemRepository implements IItemRepository {
  repository:Repository<Item>
  connection:Connection

  constructor() {
    this.connection = getConnection();
    this.repository = getRepository(Item);
  }
  find = async (id:number)=>{
    const itemData = await this.repository.findOneOrFail(id);
    const item = await new ItemModel({
      id: itemData.id,
      name: itemData.name,
      price: itemData.price,
    });
    return item;
  }

  findAll = async ()=>{
    const allItemData = await this.repository.find();
    return allItemData.map(
        (itemData) => new ItemModel({
          id: itemData.id,
          name: itemData.name,
          price: itemData.price,
        })
        ,
    );
  }

  insert = async (item:ItemModel) =>{
    const itemData = new Item();
    itemData.name = item.name;
    itemData.price = item.price;
    const insertedItemData = await this.connection
        .createQueryBuilder()
        .insert()
        .into(Item)
        .values(
            [{
              name: itemData.name,
              price: itemData.price,
            }],
        ).execute();
    return new ItemModel({
      id: insertedItemData.identifiers[0]['id'] as number,
      name: itemData.name,
      price: itemData.price,
    });
  }
}
