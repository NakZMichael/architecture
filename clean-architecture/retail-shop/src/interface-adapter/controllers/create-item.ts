import {IItemRepository} from '../../application-rules/repositories';
import {
  CreateItem,
  CreateItemRequest,
} from '../../application-rules/usecases/create-item';


export interface CreateItemControllerProps{
  itemRepository:IItemRepository
}

export class CreateItemController {
  itemRepository: IItemRepository
  constructor(props:CreateItemControllerProps) {
    this.itemRepository = props.itemRepository;
  }

  exec = async (req:CreateItemRequest) =>{
    const createItem = new CreateItem({
      repository: this.itemRepository,
    });
    return await createItem.execute(req);
  }
}
