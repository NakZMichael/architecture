import {IStoreRepository} from '../../application-rules/repositories';
import {
  CreateStore,
  CreateStoreRequest,
} from '../../application-rules/usecases/create-store';


export interface CreateStoreControllerProps{
  storeRepository:IStoreRepository
}

export class CreateStoreController {
  storeRepository:IStoreRepository

  constructor(props:CreateStoreControllerProps) {
    this.storeRepository = props.storeRepository;
  }

  exec = async (req:CreateStoreRequest) =>{
    const createStore = new CreateStore({
      repository: this.storeRepository,
    });
    return await createStore.execute(req);
  }
}
