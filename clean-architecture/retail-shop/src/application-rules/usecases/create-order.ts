import {Order} from '../../enterprise-rules/models/order';
import {
  IItemRepository,
  IOrderRepository,
  IStoreRepository,
} from '../repositories';

export interface CreateOrderProps{
  orderRepository:IOrderRepository
  itemRepository:IItemRepository
  storeRepository:IStoreRepository
}

export interface CreateOrderRequest{
  itemIds:number[]
  storeId:number
  cash:number
}

export class CreateOrder {
  orderRepository:IOrderRepository
  storeRepository:IStoreRepository
  itemRepository:IItemRepository

  constructor(params:CreateOrderProps) {
    this.orderRepository = params.orderRepository;
    this.storeRepository = params.storeRepository;
    this.itemRepository = params.itemRepository;
  }

  /**
 *
 * @param {CreateOrderRequest} formattedOrder
 */
  execute = async (formattedOrder:CreateOrderRequest):Promise<Order>=>{
    const store = await this.storeRepository.find(formattedOrder.storeId);
    const items = await Promise.all(formattedOrder.itemIds.map(
        (id) => this.itemRepository.find(id),
    ));
    const cash = formattedOrder.cash;
    const order = new Order({
      items,
      store,
      isCanceled: false,
      cash,
    });
    if (order.getChange() < 0) {
      throw new Error('頂いた金額が合計金額より少ないです。');
    }
    const insertedOrder = await this.orderRepository.insert(order);
    return insertedOrder;
  }
}
