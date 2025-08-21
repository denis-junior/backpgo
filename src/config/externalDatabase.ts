import { DataSource } from "typeorm";
import { Client } from "../entities/Client";

export async function getExternalData(client: Client) {
  //   console.log("client is ", client);
  const externalDataSource = new DataSource({
    type: "postgres",
    host: client.url_base,
    port: 5432, // ajuste se necessário
    username: client.usuario_base,
    password: client.password_base,
    database: client.data_base,
    synchronize: false,
    ssl: true,
  });
  let isOnline = false;
  try {
    await externalDataSource.initialize();
    const nowResult = await externalDataSource.query(`select now()`);
    isOnline = Array.isArray(nowResult) && nowResult.length > 0;
    const validaPagamento = await externalDataSource.query(
      `select date(now()) - date(max(paid_date)) dias_sem_venda,
        date(max(paid_date)) ultimo_pagamento from transformed_service_order_item_model tsoim 
        where 1=1;`
    );
    const validaRecebimento = await externalDataSource.query(
      `select date(now()) - date(max(schedule_created_date)) dias_sem_agendamento,
        date(max(schedule_created_date)) ultimo_agendamento, count(*) total_agendamentos from transformed_service_order_item_model tsoim 
        where 1=1;`
    );
    const doctors = await externalDataSource.query(
      `select count(*) from user_model um where um.idcargo = 'cbf980b4-b893-4a80-a131-4033498113c3' and ativo = true`
    );
    const professionalMonths = await externalDataSource.query(
      `select extract(year from datacriacao) ano, to_char(um.datacriacao,'Mon') mes, count(*)  from user_model um  where um.idcargo = 'cbf980b4-b893-4a80-a131-4033498113c3' group by extract(year from datacriacao), to_char(um.datacriacao,'Mon') order by 1,2`
    );
    await externalDataSource.destroy();
    return { validaPagamento, validaRecebimento, isOnline, doctors, professionalMonths };
  } catch (error) {
    // Se der erro, retorna isOnline como false e arrays vazios
    if (externalDataSource.isInitialized) {
      await externalDataSource.destroy();
    }
    return { validaPagamento: [{}], validaRecebimento: [{}], isOnline: false };
  }
}
