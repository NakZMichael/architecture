export interface ItemProps{
  id?:number|string
  name:string
  price:number
}

export class Item {
  id?:number|string
  name:string
  price:number

  constructor(params:ItemProps) {
    this.id = params.id;
    this.name = params.name;
    this.price = params.price;
  }
}
