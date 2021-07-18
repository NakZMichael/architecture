import {Response} from 'express';
import {Request} from 'express-serve-static-core';
import {
  CreateOrderRequest,
} from '../../application-rules/usecases/create-order';
import {CreateOrderController} from '../../interface-adapter/controllers';
import {
  ItemRepository,
  OrderRepository,
  StoreRepository,
} from '../database/repositories';

export const createOrderHandler= async (
    req:Request<any, any, CreateOrderRequest>,
    res:Response,
)=>{
  const formattedRequest:CreateOrderRequest = {
    itemIds: req.body.itemIds,
    storeId: req.body.storeId,
    cash: 10000,
  };
  console.log(formattedRequest);
  const controller = new CreateOrderController({
    itemRepository: new ItemRepository(),
    storeRepository: new StoreRepository(),
    orderRepository: new OrderRepository(),
  });
  const order = await controller.exec(formattedRequest);
  res.status(200);
  res.setHeader('Content-type', ' application/json' );
  res.write(JSON.stringify({
    id: order.id,
    items: JSON.stringify(order.items),
    store: JSON.stringify(order.store),
    cash: order.cash,
    createdAt: order.createdAt,
    subtotal: order.getSubtotal(),
    tax: order.getTax(),
    total: order.getTotal(),
    change: order.getTax(),
  }));
  res.end();
};
