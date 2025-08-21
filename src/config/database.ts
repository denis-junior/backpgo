import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Client } from '../entities/Client';
import { Seller } from '../entities/Seller';
import { Function } from '../entities/Functions';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '8000'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'drclickpgodatabase',
  synchronize: true,
  logging: false,
  entities: [User, Client, Seller, Function],
  migrations: [],
  subscribers: [],
});