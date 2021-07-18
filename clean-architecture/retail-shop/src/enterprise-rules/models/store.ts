
export interface StoreProps{
  id?:number|string
  name:string
  phoneNumber:string
}

export class Store {
  id?:number|string
  name:string
  phoneNumber:string

  constructor(params:StoreProps) {
    this.id = params.id;
    this.name = params.name;
    this.phoneNumber = params.phoneNumber;
  }
}
