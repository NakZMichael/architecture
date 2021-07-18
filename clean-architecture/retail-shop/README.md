# Clean Architecture の実践 ~ 小売店のレジシステムを作ってみる　~

クリーンアーキテクチャというと以下の図が有名である

![クリーンアーキテクチャの円](./docs/CleanArchitecture.jpeg)

[クリーンアーキテクチャ(The Clean Architecture翻訳)](https://blog.tai2.net/the_clean_architecture.html)より引用

今回はこのアーキテクチャの基本に沿って実装してみる。

## システムの概要

クリーンアーキテクチャではドメイン固有のビジネスロジック(Enterprise Business Rules)とアプリケーション固有のルール(Application Business Rules)とアプリケーション固有のロジックとデータベースやデバイスなど環境に左右されるものを繋ぐレイヤー(Interface Adapters)とORMやWebフレームワークなどを構成する(Framework & Driver)の4つのレイヤーに分割する手法が主流である。
その本質は上位3レイヤーを様々なプラットホームや言語に移植しやすくできる点にあるように思う。
Webフレームワークやデータベースドライバやファイルシステムなどは環境によって変化しがちだが上位3レイヤーのロジックそのものは変化させずに移植することが可能な場合がいくらかあるように思う。(オンプレミスのファイルシステムからAWSのS3に切り替える時などにビジネスロジックやユースケースのレイヤーのコードを変更させずに済ませたい。)

そういうわけなのでロジックの少ないアプリケーションにはあまり向いていないアーキテクチャであると思う。
実際に、後から書いていくようにフレームワークやデータベースへの依存を減らすためにかなりコード量が増えるからだ。

したがって簡単なTODOアプリではなく、もう少しだけ複雑にして小売店で注文を受けてから、注文を記録し、商品の合計金額とお釣りを計算するアプリを作成する。
また、注文の打ち間違いやキャンセルなども発生すると思われるので記録から削除する機能も作成する。

技術的な詳細についてだがTypeScript,Express,TypeORMを使用して実装していく。

## ディレクトリの分け方

クリーンアーキテクチャの円は先ほどのべた4つの円で構成されている。
また、円をまたぐ時には外側から内側へのアクセスのみが許されている。
つまり、内側のレイヤーは外側のレイヤーの関数やクラスをインポートしてはならない。
例えば、ビジネスロジックのレイヤーはデータベースは何を使っているだとか、REST APIなのかGraphQLなのかなどという詳細を知っていてはならないのである。

ということで以下のコマンドをプロジェクトのルートディレクトリで実行する。

```
mkdir ./src/enterprise-rules
mkdir ./src/application-rules
mkdir ./src/interface-adapter
mkdir ./src/frameworks
```

## 初めの1歩

店舗を登録するところから始めてみよう。

### Enterprise Business Rulesレイヤー

Enterprise Business Rulesのレイヤーにモデルを定義していく。
idはauto incrementのもの(リレーショナルデータベースで自動でつくやつ)を使うかuuid(NoSQLだとこっち)になるかで変わってくるのでクリーンアーキテクチャの特徴の一つである移植性を活かすためにどちらにも対応できるよう`number|string|undefined`型にしてみたが初めからuuidに統一するようにしておけばidの型に応じて場合分けの処理をする必要もなくなりコードが幾分か綺麗になるだろうし、idの大小で評価する類のロジックを使用していた場合NoSQLへの移植が難しくなる。
ただし、MySQLを使用している場合primary keyをuuidにしているとinsertの性能が徐々に落ちていくらしい。(実際のところ確認してみてないのでわからないが)

```TypeScript: src/enterprise-rules/models/store.ts
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
```

### Application Business Rulesレイヤー

次にApplication Business Rulesのレイヤーにデータを操作するrepositoryインターフェースを定義する。
Application Business Rulesレイヤーではカプセル化されたデータの永続化などの処理を呼び出す必要があるので対応するインターフェースをここで作成する必要がある。
このインターフェースを満たす実装を作成するのはFramework & Driverのレイヤーで行うことになる。
Interface AdapterレイヤーのGatewayで実装を行う例もあるようだが、データベースを使う場合、実装の詳細はデータベースの種類による場合が多いのでFramework & Driverに書くのが妥当であると思う。

```TypeScript: src/application-rules/repositories/order-repository.ts
export interface IStoreRepository{
  insert(store:Store):Promise<Store>
  find(id:number|string):Promise<Store>
  findAll():Promise<Store[]>
}
```

それではこれを用いて実際にユースケースを作成してみよう。
やっていることは単純にリクエストを受け取ってデータを挿入して結果を返しているだけである。
リクエストの形をみるとわかると思うが、expressなどのリクエストではなくどちらかというとそれのボディーにあたるように見えると思う。
これはウェブフレームワークで通信しているのかデスクトップアプリ(店舗を拡大する気の無い個人商店などはこれで十分だろう)で動作しているのかに関係なく動作させるためである。
通常、ロギングを行う層はここにしたほうがいいと思うので
ロギングに必要なコンテキスト(リクエストの発信者のIPアドレスやリクエストごとの一意なトラッキングIDなど)はリクエストに含めるかコンストラクターに渡すなどする必要があるように思う。

```TypeScript: src/application-rules/usecases/create-store.ts
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
```

### Interface Adaptersレイヤー

#### Gateway

Gatewayとはデータベースやファイルシステムのアダプターとなるように先ほどApplication Business Rules層で定義した`IStoreRepository`などのレポジトリーインターフェースを満たすものだ。

原典では[**同じように、データはこのレイヤーで、エンティティーやユースケースにもっとも便利な形から、どんな永続化フレームワークが使われているにしろ、それにとってもっとも便利な形に変換される。例えば、データベースなど。この円よりも内側のコードは、データベースについてなにも知るべきではない。もしこのデータベースがSQLデータベースであるならば、どんなSQLであれ、このレイヤーに、もっと言うと、このレイヤーの中のデータベースに関連した部分に、制限されるべきだ。**](https://blog.tai2.net/the_clean_architecture.html)と述べられている。

これの扱いが今回最も悩んだ部分だ、主題と言っても過言ではない。
簡単な実例を示すだけならTypeORMを使わずに素のSQLを使ってデータベースを操作しても良かったかもしれないがGatewayに焦点を当てるためにORMを使用してみた。

まず、 **ORMを使うとSQLを組み立てる場所であるGatewayはどうなるんだ？** という疑問が沸くだろう。
ただし、ORMを使う場合であってもチューニングが必要な場合などに素のSQLを書くことはよくある。
それではやはりORMのコードを書くのもGatewayなのだろうか？

しかし、私は[書籍化されたもの](https://www.amazon.co.jp/dp/B07FSBHS2V/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1)も持っているのだ。
そこでは要約するとORMはドライバに過ぎないのでFramework & Driverのレイヤーに置けと書いてある。

頭が痛い。

そこでClean Architectureの原点に立ち返ってみる。

以下が原典で述べられているClean Architectureのメリットだ

- フレームワーク独立。アーキテクチャは、機能満載のソフトウェアのライブラリが手に入ることには依存しない。これは、そういったフレームワークを道具として使うことを可能にし、システムをフレームワークの限定された制約に押し込めなければならないようなことにはさせない。
- テスト可能。ビジネスルールは、UI、データベース、ウェブサーバー、その他外部の要素なしにテストできる。
- UI独立。UIは、容易に変更できる。システムの残りの部分を変更する必要はない。たとえば、ウェブUIは、ビジネスルールの変更なしに、コンソールUIと置き換えられる。
- データベース独立。OracleあるいはSQL Serverを、Mongo, BigTable, CoucheDBあるいは他のものと交換することができる。ビジネスルールは、データベースに拘束されない。
- 外部機能独立。実際のところ、ビジネスルールは、単に外側についてなにも知らない。

Clean Architectureを採用する以上データベース独立でなくては十分にパワーを発揮できている状態とは言えないであろう。
そして、実際のところSQLとはデータベースの種類に依存するものだ。リレーショナルデータベースに限って見ても特定のデータベースにしかない便利な機能というものは往々にしてあるものだし、NoSQLなども視野に入れれば比べるまでもないだろう。
そこでデータベースをMySQLからMongoDBに切り替えてみることを考えてみる。

GatewayにORMのコードを書いていた場合、もちろんここも書き換えることになるが、さらにその外側のFramework & Driverレイヤーにあるデータベースのコネクションなどのコードも書き換える必要があるだろう。

つまり、GatewayにORMのコードを書いた場合、二つの層にまたがってコードを修正する必要があり、Clean Architectureの一つの目的である移植性の向上にも失敗しているし、外側のレイヤーの修正が内側のレイヤーに直に影響を与えており何のためにレイヤーを分けているのか全くわからない結果となってしまっている。

ここまで来て私はレポジトリーのインターフェースの実装はFramework & Driverレイヤーに置くべきであるという結論に達した。

#### controllers

ここにはFramework & DriverレイヤーにあるHTTPなどのプロトコルの詳細を含んだリクエストを整形するコントローラーから渡されたデータを使ってユースケースを実行するコードを書く。
ただし、ボイラープレートという他ないようなコードになってしまった。
以下に実例を示す。

```TypeScript: rc/interface-adapter/controllers/create-item.ts
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
```

やっていることはレポジトリーのインターフェースを満たすインスタンスを受け取り、Application Business Rulesのレイヤーで定義した`CreateItem`インスタンスを使用しているだけだ。
正直言って、あまり必要でないレイヤーだと思う。
ここで直接Expressを使うコードを書くと先ほどのORMの議論と同様にデスクトップアプリからウェブアプリに移植する場合などに二つのレイヤーに跨ってコードを書く必要が出てしまうのでそれはできないのだ。

このコードを見ればわかるが、何もしていないに等しい。
Gatewayと同様になくしてしまっても全く問題がないだろう。

### Framework & Driverレイヤー

名前が長いので仕方なくFrameworkディレクトリと名付けている。

ここにロジックと無関係なデータベースやウェブなどの詳細を書き込んでいく。原典ではこのレイヤーにはコードをあまり書かないとあるが、先ほど述べたように私の実装の場合にはInterface Adapterレイヤーがほとんどハリボテになっているためこのレイヤーのコードは比較的多くなる。

まず、データベース関連のコードから見ていく。
エンタティの定義は以下のようになっている。
特筆すべきことは何もないTypeORMのエンタティである。

```TypeScript: src/frameworks/database/entities/order.ts
@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id?:number;

  @Column()
  name!:string;

  @Column()
  phoneNumber!:string;
}
```

次にこれを使用してApplication Rulesレイヤーで定義した`IStoreRepository`インターフェースの実装を作成する。
まあ、面白いことは何もないが以下のような実装が素朴だと思う。
見てわかるようにデータベースに都合の良いように定義されている。Storeをビジネスロジックに都合のいいStore(このファイルでは名前が被ってしまったのでStoreModelとエイリアスをつけている)に変換している。
これがこのレイヤーの役割になるだろう。(原典ではInterface Adapterレイヤーで行うように書かれているが、、、)

```TypeScript: src/frameworks/database/repositories/store-repository.ts
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
```

最後にExpressを用いたコントローラーのコードを書く。
Expressフレームワークから受け取ったRequestをInterface Adapterで定義したコントローラーにとって都合の良い形に変換して引き渡してデータを結果を受け取ってレスポンスを返す。
Interface Adapterレイヤーが冗長だと感じたならユースケースにとって都合の良い形にリクエストを整形して直接ユースケースに渡せば良い。

```TypeScript: src/frameworks/controllers/create-store.ts

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
```

### main関数

ルーターの実装を書くコードとmain関数は分けている。
main関数には極力設定以外は描きたくないからだ。(そうは言いつつも割と書いてしまってるがご愛嬌)

```TypeScript: src/frameworks/server.ts
export function getRouter() {
  const app = express();

  app.use(express.json());

  app.post('/api/createItem', (req, res, next)=>{
    createItemHandler(req, res)
        .catch((err)=>{
          console.log(err);
          next();
        });
  });
  app.post('/api/createStore', (req, res, next)=>{
    createStoreHandler(req, res)
        .catch((err)=>{
          console.log(err);
          next();
        });
  });
  app.post('/api/createOrder', (req, res, next)=>{
    createOrderHandler(req, res)
        .catch((err)=>{
          console.log(err);
          next();
        });
  });
  app.get('/api/getAllOrders', (req, res, next)=>{
    getAllOrdersHandler(req, res)
        .catch((err)=>{
          console.log(err);
          next();
        });
  });

  return app;
}
```

```TypeScript: src/index.ts
async function main() {
  await createConnection({
    'type': 'mysql',
    'host': 'node_db',
    'port': 3306,
    'username': process.env['MARIADB_USER'],
    'password': process.env['MARIADB_PASSWORD'],
    'database': process.env['MARIADB_DATABASE'],
    'synchronize': true,
    'logging': false,
    'entities': [
      'src/frameworks/database/entities/**.ts',
    ],
  }).catch((err)=>console.log(err));

  getRouter().listen(3000, ()=>{
    console.log('listing on port http://localhost:3000');
  });
}

main();
```

この時点で以下のコードを実行すれば`{"id":4,"name":"成城石井本店","phoneNumber":"0120-111-111"}`のようなレスポンスが帰ってくるだろう。(念の為言っておくが成城石井の電話番号はきっとこれじゃない。)

```
curl -X POST -H "Content-Type: application/json" \
    -d '{"name": "成城石井本店","phoneNumber": "0120-111-111"}' \
    http://localhost:3000/api/createStore
```

### 今までを振り返る。

ここまでがイントロダクションだ。
イントロダクションなのにかなり長い。私も正直かなり書くのを飽きてきている。

何故こうまで長くなったのかいくつかの原因が考えられる

- レイヤーをまたぐためにデータを変換するために多くのインターフェースを定義する必要がある。
- 変換用のボイラープレートコードが多い。特にInterface Adapterレイヤーはほぼボイラープレートになりがち。

ここで私は一つの結論に達した。Interface Adapterレイヤーいらないじゃんと。

更にClean Architectureはレイヤーとレイヤーの間に新しいレイヤーを作ることもそう難しいことではないので、最初はInterface Adapterレイヤーは作らずに必要になったら作れば良いだろう。

## 注文を記録する

先ほども言ったように飽きているのでコードを貼り付けていくつか追加で述べたい部分だけコメントする。
また、Storeの他にItemも作っているがそこについては触れない。githubのコードを見て欲しい。

## Enterprise Business Rulesレイヤー

ドメイン固有のビジネスルールをこのレイヤーに書くとは以下のようなことを指しているのだ。

例えば、商品の税抜きの合計から消費税を計算したり。お預かりからお釣りを計算するなどは小売店の業務特有のビジネスルールだろう。だからOrderクラスはそれらのロジックを備えるのだ。
OrderクラスはプレーンオールドなJavaScriptオブジェクトにしておいて。このレイヤー内の関数にこれらの機能を分離しても良い。

```TypeScript: src/enterprise-rules/models/order.ts
import {Item} from './item';
import {Store} from './store';

export interface OrderProps{
  id?:number|string
  items:Item[]
  store:Store
  isCanceled:boolean
  cash:number
  createdAt?:Date
}

export class Order {
  id?:number|string
  customer?:string
  items:Item[]
  store:Store
  isCanceled:boolean
  cash:number
  createdAt?:Date

  static taxRate:number = 0.08

  constructor(params:OrderProps) {
    this.id = params.id;
    this.items = params.items;
    this.store = params.store;
    this.isCanceled = params.isCanceled;
    this.createdAt = params.createdAt;
    this.cash = params.cash;
  }

  getSubtotal = ():number=>{
    return this.items.reduce((prevPrice, currentItem)=>{
      return prevPrice +currentItem.price;
    }, 0);
  }
  getTotal = ():number =>{
    return this.getSubtotal() + this.getTax();
  }
  getTax = ():number =>{
    return Math.floor(this.getSubtotal() * Order.taxRate );
  }

  getChange = ():number => {
    return this.cash - this.getTotal();
  }
}
```

### Application Business Rulesレイヤー

```TypeScript: src/application-rules/repositories/order-repository.ts
export interface IOrderRepository{
  insert(order:Order):Promise<Order>
  find(id:number|string):Promise<Order>
  findAll():Promise<Order[]>
  delete(id:number|string):Promise<boolean>
}
```

以下のコードでは`order.getChange() < 0`によってお預かりが合計金額より多いかどうか判断してエラーハンドリングしているが、本来であればOrderクラスに`isValidOrder()`メソッドなどを持たせてエラーハンドリングするのが正しいレイヤーの分離だと思う。
正直、直すのがめんどくさいので放置しているが、間違ったレイヤーの分け方の良い一例になっているように思う。

フレームワークやデータベースに依存しないアプリケーション固有のエラーハンドリングやデータの永続化などは全てこのユースケース層に書くのが良い。

```TypeScript: src/application-rules/usecases/create-order.ts

export interface CreateOrderProps{
  orderRepository:IOrderRepository
  itemRepository:IItemRepository
  storeRepository:IStoreRepository
}

export interface CreateOrderRequest{
  itemIds:number[]
  storeId:number
  cash:number
}

export class CreateOrder {
  orderRepository:IOrderRepository
  storeRepository:IStoreRepository
  itemRepository:IItemRepository

  constructor(params:CreateOrderProps) {
    this.orderRepository = params.orderRepository;
    this.storeRepository = params.storeRepository;
    this.itemRepository = params.itemRepository;
  }

  /**
 *
 * @param {CreateOrderRequest} formattedOrder
 */
  execute = async (formattedOrder:CreateOrderRequest):Promise<Order>=>{
    const store = await this.storeRepository.find(formattedOrder.storeId);
    const items = await Promise.all(formattedOrder.itemIds.map(
        (id) => this.itemRepository.find(id),
    ));
    const cash = formattedOrder.cash;
    const order = new Order({
      items,
      store,
      isCanceled: false,
      cash,
    });
    if (order.getChange() < 0) {
      throw new Error('頂いた金額が合計金額より少ないです。');
    }
    const insertedOrder = await this.orderRepository.insert(order);
    return insertedOrder;
  }
}
```

### Interface Adapterレイヤー

見るからにボイラープレート。
やはり、必要ないのでは、、、

```TypeScript: src/interface-adapter/controllers/create-order.ts

export interface CreateOrderControllerProps{
  orderRepository:IOrderRepository
  itemRepository:IItemRepository
  storeRepository:IStoreRepository
}

export class CreateOrderController {
  orderRepository:IOrderRepository
  itemRepository:IItemRepository
  storeRepository:IStoreRepository

  constructor(props:CreateOrderControllerProps) {
    this.orderRepository =props.orderRepository;
    this.itemRepository = props.itemRepository;
    this.storeRepository = props.storeRepository;
  }
  exec = async (req:CreateOrderRequest)=>{
    const createOrder = new CreateOrder({
      orderRepository: this.orderRepository,
      itemRepository: this.itemRepository,
      storeRepository: this.storeRepository,
    });
    return await createOrder.execute(req);
  }
}
```

### Framework & Driverレイヤー

```TypeScript: src/frameworks/database/entities/order.ts
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id?:number;

  @ManyToMany((type) => Item)
  @JoinTable()
  items!:Item[];

  @ManyToOne((type) => Store, {
    cascade: false,
  })
  @JoinTable()
  store!:Store;

  @Column()
  isCanceled!:boolean;

  @Column()
  cash!:number;

  @Column()
  subtotal!:number;

  @Column()
  tax!:number;

  @CreateDateColumn({name: 'created_at', type: 'timestamp', precision: 0})
  readonly createdAt?: Date;
}
```

他のテーブルと関係がある場合は少々コードが増えてしまう印象がある。
ただ、データベースに都合の良いデータ設計のままだとビジネスルールには扱いづらすぎるのでここで一度変換するのは必要なことだと思う。

```TypeScript: src/frameworks/database/repositories/order-repository.ts
import {Connection, getConnection, getRepository, Repository} from 'typeorm';
import {IOrderRepository} from '../../../application-rules/repositories';
import {
  Item as ItemModel,
  Store as StoreModel,
  Order as OrderModel} from '../../../enterprise-rules';
import {Item} from '../entities/item';
import {Order} from '../entities/order';
import {Store} from '../entities/store';

export class OrderRepository implements IOrderRepository {
  connection:Connection
  repository:Repository<Order>

  constructor() {
    this.connection = getConnection();
    this.repository = getRepository(Order);
  }

  find = async (id:number)=>{
    const orderData = await this.repository.findOneOrFail(id, {
      relations: ['store', 'items'],
    });
    const items = orderData.items.map((itemData) => {
      return new ItemModel({
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
      });
    });
    const store = new StoreModel({
      id: orderData.store.id,
      name: orderData.store.name,
      phoneNumber: orderData.store.phoneNumber,
    });
    return new OrderModel({
      id: orderData.id,
      items: items,
      store: store,
      cash: orderData.cash,
      isCanceled: orderData.isCanceled,
    });
  }

  findAll = async ()=>{
    const allOrderData = await this.repository.find({
      relations: ['store', 'items'],
    });
    console.log(allOrderData);
    return allOrderData.map((orderData) => {
      const items = orderData.items.map((itemData) => {
        return new ItemModel({
          id: itemData.id,
          name: itemData.name,
          price: itemData.price,
        });
      });
      const store = new StoreModel({
        id: orderData.store.id,
        name: orderData.store.name,
        phoneNumber: orderData.store.phoneNumber,
      });
      return new OrderModel({
        id: orderData.id,
        items: items,
        store: store,
        cash: orderData.cash,
        isCanceled: orderData.isCanceled,
      });
    });
  }

  insert = async (order:OrderModel)=>{
    const itemsData = await Promise.all(order.items.map((item)=>{
      return this.connection.getRepository(Item).findOneOrFail(item.id);
    }));
    const storeData = await this.connection.getRepository(Store)
        .findOneOrFail(order.store.id);

    const orderData = new Order();
    orderData.items = itemsData;
    orderData.store =storeData;
    orderData.tax = order.getTax();
    orderData.subtotal = order.getSubtotal();
    orderData.cash = order.cash;
    orderData.isCanceled = false;

    const insertResult = await this.repository.save(orderData);
    orderData.id = insertResult.id;
    console.log( insertResult);
    return new OrderModel({
      id: orderData.id,
      items: order.items,
      store: order.store,
      cash: order.cash,
      isCanceled: false,
      createdAt: orderData.createdAt,
    });
  }

  delete = async (id:number)=>{
    await this.repository.delete(id);
    return true;
  }
}
```


```TypeScript: src/frameworks/controllers/create-order.ts
export const createOrderHandler= async (
    req:Request<any, any, CreateOrderRequest>,
    res:Response,
)=>{
  const formattedRequest:CreateOrderRequest = {
    itemIds: req.body.itemIds,
    storeId: req.body.storeId,
    cash: 10000,
  };
  console.log(formattedRequest);
  const controller = new CreateOrderController({
    itemRepository: new ItemRepository(),
    storeRepository: new StoreRepository(),
    orderRepository: new OrderRepository(),
  });
  const order = await controller.exec(formattedRequest);
  res.status(200);
  res.setHeader('Content-type', ' application/json' );
  res.write(JSON.stringify({
    id: order.id,
    items: JSON.stringify(order.items),
    store: JSON.stringify(order.store),
    cash: order.cash,
    createdAt: order.createdAt,
    subtotal: order.getSubtotal(),
    tax: order.getTax(),
    total: order.getTotal(),
    change: order.getTax(),
  }));
  res.end();
};
```

これで注文を記録するところまでこれた。
以下のようなリクエストを投げればレスポンスが帰ってくる。

```
application/json" \
    -d '{"itemIds":[1,2,3],"storeId":1,"cash":20000}' \          
    http://localhost:3000/api/createOrder
```

ただし、その前に商品を三つ作成する必要があるので以下のコマンドを3回叩くこと

```
curl -X POST -H "Content-Type: application/json" \
    -d '{"name": "wilkinson","price": 100}' \                    
    http://localhost:3000/api/createItem 
```

## 総括

注文をキャンセルするところまでコードを書いていないが飽きてしまったのでここでやめます。。。

今まで本で読んだことはあって何となく理解したつもりでいたが、実際に自分でコードを書いてみると思った以上に発見がありました。


Spring BootやNestJSでコントローラーとモデルの間にサービスを置くことがありますが、サービスをより細かく厳格にレイヤーに分けたものがクリーンアーキテクチャの正体なんだろうなと感じました。
サービスのロジックをできるだけ普遍的にして特定のフレームワークによらないようにすることがアプリケーションの移植性を高めることに繋がるんだなーと実感しました。

クリーンアーキテクチャを採用するとどうしてもボイラープレートが増えてしまう感じはしますが、今回はめんどくさくて書かなかったテストなどが上位レイヤーでは書きやすくなるので、ビジネスロジック単体でテストできるようになります。
なので、何か問題が起こった時にどのレイヤーに問題が起きたのか特定しやすくなり、結果的に開発速度が上がることもある程度規模の大きなアプリケーションでは起こるんだろうなという気もしました。

現段階の私の理解ではクリーンアーキテクチャを厳格に守らずにMVCなどのアーキテクチャでモデル層とコントローラー層の間にサービス層を設けて、そこにロジックをたくさん書くようにするくらいが開発速度と保守性とテスタビリティが良い塩梅になるんじゃないかなと個人的に結論づけたいと思います。


# 開発環境の構築方法

書き終わった後にデータベースの設定とか無くて不親切だなと思いました。
普段Node.JS + TypeScriptで環境構築するときは以下のようにしています。
自分で書いた雑イングリッシュで申し訳ないですが、書き直す体力はないです。
アプリケーションを動かすだけなら。`docker-compose up -d`やってもらって、nodeサーバー用のコンテナのシェルに入ってもらって`yarn dev`で開発用サーバーが立ち上がります。


# How to set up a project with TypeScript

```
yarn init
yarn add --dev typescript ts-node ts-node-dev jest
npx tsc --init
mkdir src
mkdir dist
```

And config `./tsconfig.json` like the one in this project.

# How to set up Eslint and auto fix

```
yarn add -D eslint
yarn eslint --init
```

And config `./.vscode/settings.json` like below

```
{
  "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
  },
}
```

# How to develop in a docker container

```
docker-compose build
docker-compose up -d
```

Then use the extension of Visual Studio Code, `Remote - Containers` and `ESLint`.

# How to test

Install packages below.

```
yarn add -D jest @types/jest ts-jest
```

Then add `jest.config.js` and write codes below.

```
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
```

Finaly, add script below to `package.json`.

```
{
  "test": "jest --coverage --verbose"
}
```

# How to start Express application

We already wrote package.json, so that just execute a command below to start the Express application.  

```
yarn start
```
