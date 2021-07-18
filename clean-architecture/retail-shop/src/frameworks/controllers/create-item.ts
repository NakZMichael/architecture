import {Response} from 'express';
import {Request} from 'express-serve-static-core';
import {CreateItemRequest} from '../../application-rules/usecases/create-item';
import {CreateItemController} from '../../interface-adapter/controllers';
import {ItemRepository} from '../database/repositories';

export const createItemHandler= async (
    req:Request<any, any, CreateItemRequest>,
    res:Response,
)=>{
  const formattedRequest:CreateItemRequest = {
    name: req.body.name,
    price: req.body.price,
  };
  console.log(formattedRequest);
  const controller = new CreateItemController({
    itemRepository: new ItemRepository(),
  });
  const item = await controller.exec(formattedRequest);
  res.status(200);
  res.setHeader('Content-type', ' application/json' );
  res.write(JSON.stringify(item));
  res.end();
};
