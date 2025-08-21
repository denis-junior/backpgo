import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Client } from "../entities/Client";
import { Seller } from "../entities/Seller";
import { Function } from "../entities/Functions";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "drclickpgo",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Client, Seller, Function],
  migrations: [],
  subscribers: [],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});