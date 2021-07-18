import {Store} from '../../enterprise-rules/models/store';

export interface IStoreRepository{
  insert(store:Store):Promise<Store>
  find(id:number|string):Promise<Store>
  findAll():Promise<Store[]>
}
