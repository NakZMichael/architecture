import {
  IItemRepository,
  IOrderRepository, IStoreRepository,
} from '../../application-rules/repositories';
import {
  CreateOrder,
  CreateOrderRequest,
} from '../../application-rules/usecases/create-order';


export interface CreateOrderControllerProps{
  orderRepository:IOrderRepository
  itemRepository:IItemRepository
  storeRepository:IStoreRepository
}

export class CreateOrderController {
  orderRepository:IOrderRepository
  itemRepository:IItemRepository
  storeRepository:IStoreRepository

  constructor(props:CreateOrderControllerProps) {
    this.orderRepository =props.orderRepository;
    this.itemRepository = props.itemRepository;
    this.storeRepository = props.storeRepository;
  }
  exec = async (req:CreateOrderRequest)=>{
    const createOrder = new CreateOrder({
      orderRepository: this.orderRepository,
      itemRepository: this.itemRepository,
      storeRepository: this.storeRepository,
    });
    return await createOrder.execute(req);
  }
}
