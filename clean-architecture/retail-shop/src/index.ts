import {createConnection} from 'typeorm';
import {getRouter} from './frameworks/server';

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
