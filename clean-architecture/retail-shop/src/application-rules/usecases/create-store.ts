import {Store} from '../../enterprise-rules';
import {IStoreRepository} from '../repositories';

export interface CreateStoreRequest{
  name:string,
  phoneNumber:string
}

export interface CreateStoreProps{
  repository:IStoreRepository
}

export class CreateStore {
  repository:IStoreRepository

  constructor(props:CreateStoreProps) {
    this.repository = props.repository;
  }

  execute = async (req:CreateStoreRequest)=>{
    const store = await this.repository.insert(new Store({
      name: req.name,
      phoneNumber: req.phoneNumber,
    }));
    return store;
  }
}
