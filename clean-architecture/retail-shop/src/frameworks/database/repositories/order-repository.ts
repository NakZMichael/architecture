import {Connection, getConnection, getRepository, Repository} from 'typeorm';
import {IOrderRepository} from '../../../application-rules/repositories';
import {
  Item as ItemModel,
  Store as StoreModel,
  Order as OrderModel} from '../../../enterprise-rules';
import {Item} from '../entities/item';
import {Order} from '../entities/order';
import {Store} from '../entities/store';

export class OrderRepository implements IOrderRepository {
  connection:Connection
  repository:Repository<Order>

  constructor() {
    this.connection = getConnection();
    this.repository = getRepository(Order);
  }

  find = async (id:number)=>{
    const orderData = await this.repository.findOneOrFail(id, {
      relations: ['store', 'items'],
    });
    const items = orderData.items.map((itemData) => {
      return new ItemModel({
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
      });
    });
    const store = new StoreModel({
      id: orderData.store.id,
      name: orderData.store.name,
      phoneNumber: orderData.store.phoneNumber,
    });
    return new OrderModel({
      id: orderData.id,
      items: items,
      store: store,
      cash: orderData.cash,
      isCanceled: orderData.isCanceled,
    });
  }

  findAll = async ()=>{
    const allOrderData = await this.repository.find({
      relations: ['store', 'items'],
    });
    console.log(allOrderData);
    return allOrderData.map((orderData) => {
      const items = orderData.items.map((itemData) => {
        return new ItemModel({
          id: itemData.id,
          name: itemData.name,
          price: itemData.price,
        });
      });
      const store = new StoreModel({
        id: orderData.store.id,
        name: orderData.store.name,
        phoneNumber: orderData.store.phoneNumber,
      });
      return new OrderModel({
        id: orderData.id,
        items: items,
        store: store,
        cash: orderData.cash,
        isCanceled: orderData.isCanceled,
      });
    });
  }

  insert = async (order:OrderModel)=>{
    const itemsData = await Promise.all(order.items.map((item)=>{
      return this.connection.getRepository(Item).findOneOrFail(item.id);
    }));
    const storeData = await this.connection.getRepository(Store)
        .findOneOrFail(order.store.id);

    const orderData = new Order();
    orderData.items = itemsData;
    orderData.store =storeData;
    orderData.tax = order.getTax();
    orderData.subtotal = order.getSubtotal();
    orderData.cash = order.cash;
    orderData.isCanceled = false;

    const insertResult = await this.repository.save(orderData);
    orderData.id = insertResult.id;
    console.log( insertResult);
    return new OrderModel({
      id: orderData.id,
      items: order.items,
      store: order.store,
      cash: order.cash,
      isCanceled: false,
      createdAt: orderData.createdAt,
    });
  }

  delete = async (id:number)=>{
    await this.repository.delete(id);
    return true;
  }
}
