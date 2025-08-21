import { DataSource } from "typeorm";
import { Client } from "../entities/Client";

export const createExternalDatabase = (client: Client) => {
  const externalDataSource = new DataSource({
    type: "postgres",
    host: client.url_base,
    port: 5432, // ajuste se necessário
    username: client.usuario_base,
    password: client.password_base,
    database: client.data_base,
    entities: [], // adicione entidades se precisar mapear tabelas
    synchronize: false,
    ssl: true,
  });

  return externalDataSource;
};
