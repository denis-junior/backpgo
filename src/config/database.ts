import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Client } from "../entities/Client";
import { Seller } from "../entities/Seller";
import { Function } from "../entities/Functions";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para Railway
  },
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Client, Seller, Function],
  migrations: [],
  subscribers: [],
});