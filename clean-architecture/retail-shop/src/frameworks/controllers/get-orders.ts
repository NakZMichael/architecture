import {Request, Response} from 'express';
import {OrderRepository} from '../database/repositories';

export const getAllOrdersHandler= async (
    req:Request,
    res:Response,
)=>{
  const orderRepository = new OrderRepository();
  const orders = await orderRepository.findAll();
  res.status(200);
  res.setHeader('Content-type', ' application/json' );
  res.write(JSON.stringify(
      orders.map((order)=>
        ({
          id: order.id,
          items: JSON.stringify(order.items),
          store: JSON.stringify(order.store),
          cash: order.cash,
          createdAt: order.createdAt,
          subtotal: order.getSubtotal(),
          tax: order.getTax(),
          total: order.getTotal(),
          change: order.getTax(),
        }),
      )));
  res.end();
};
