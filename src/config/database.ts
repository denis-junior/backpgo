import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Client } from "../entities/Client";
import { Seller } from "../entities/Seller";
import { Function } from "../entities/Functions";

export const AppDataSource = new DataSource({
  type: "postgres", // ou 'mysql', dependendo do seu banco
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Client, Seller, Function],
  migrations: [],
  subscribers: [],
});