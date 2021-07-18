import {Response} from 'express';
import {Request} from 'express-serve-static-core';
import {
  CreateStoreRequest,
} from '../../application-rules/usecases/create-store';
import {CreateStoreController} from '../../interface-adapter/controllers';
import {StoreRepository} from '../database/repositories';

export const createStoreHandler= async (
    req:Request<any, any, CreateStoreRequest>,
    res:Response,
)=>{
  const formattedRequest:CreateStoreRequest = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
  };
  console.log(formattedRequest);
  const controller = new CreateStoreController({
    storeRepository: new StoreRepository(),
  });
  const store = await controller.exec(formattedRequest);
  res.status(200);
  res.setHeader('Content-type', ' application/json' );
  res.write(JSON.stringify(store));
  res.end();
};
