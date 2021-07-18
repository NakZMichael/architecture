import {Connection, getConnection, getRepository, Repository} from 'typeorm';
import {IStoreRepository} from '../../../application-rules/repositories';
import {Store} from '../entities/store';
import {Store as StoreModel} from '../../../enterprise-rules/models';

export class StoreRepository implements IStoreRepository {
  repository:Repository<Store>
  connection:Connection

  constructor() {
    this.connection = getConnection();
    this.repository = getRepository(Store);
  }

  find = async (id:number)=>{
    const storeData = await this.repository.findOneOrFail(id);
    const store = await new StoreModel({
      id: storeData.id,
      name: storeData.name,
      phoneNumber: storeData.phoneNumber,
    });
    return store;
  }

  findAll = async ()=>{
    const allStoreData = await this.repository.find();
    return allStoreData.map(
        (storeData) => new StoreModel({
          id: storeData.id,
          name: storeData.name,
          phoneNumber: storeData.phoneNumber,
        })
        ,
    );
  }

  insert = async (store:StoreModel) =>{
    const storeData = new Store();
    storeData.name = store.name;
    storeData.phoneNumber = store.phoneNumber;
    const insertedStoreData = await this.connection
        .createQueryBuilder()
        .insert()
        .into(Store)
        .values(
            [{
              name: storeData.name,
              phoneNumber: storeData.name,
            }],
        ).execute();
    return new StoreModel({
      id: insertedStoreData.identifiers[0]['id'] as number,
      name: storeData.name,
      phoneNumber: storeData.phoneNumber,
    });
  }
}
