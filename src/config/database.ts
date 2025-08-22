import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Client } from "../entities/Client";
import { Seller } from "../entities/Seller";
import { Function } from "../entities/Functions";

console.log('=== DATABASE CONFIG ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  synchronize: true, // Mudando para true temporariamente para debug
  logging: true, // Ativando logs sempre para debug
  entities: [User, Client, Seller, Function],
  migrations: [],
  subscribers: [],
  extra: {
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
  }
});