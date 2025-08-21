import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Client } from "../entities/Client";
import { getExternalData } from "../config/externalDatabase";

export class DashboardController {
  async getAllClients(req: Request, res: Response) {
    const clients = (await AppDataSource.getRepository(Client).find()).filter(client => client.status === "CONVERTIDO" || client.status === "UPSELL");
    const results = [];
    let allDoctors = 0;

    for (const client of clients) {
      if (
        client.url_base &&
        client.usuario_base &&
        client.password_base &&
        client.data_base
      ) {
        try {
          const data = await getExternalData(client);
          // console.log(`Professional months for client ${client.data_base}: ${JSON.stringify(data.professionalMonths)}`);
          allDoctors += Number(data.doctors?.[0].count) || 0;
          const newData = {
            validaPagamento: data.validaPagamento?.[0] || {},
            validaRecebimento: data.validaRecebimento?.[0] || {},
            isOnline: data.isOnline,
            professionalMonths: data.professionalMonths || [],
          };

          results.push({
            client_id: client.id_cliente,
            client_name: client.nome_fantasia,
            ...newData,
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          results.push({ client: client.id_cliente, error: errorMessage });
        }
      }
    }

    res.json({clinics: results, totalDoctors: allDoctors});
  }

  //   async getClientById(req: Request, res: Response) {
  //     try {
  //       const { id } = req.params;
  //       const client = await clientRepository.findOne({
  //         where: { id_cliente: parseInt(id), deleted_at: IsNull() },
  //       });

  //       if (!client) {
  //         return res.status(404).json({ message: "Client not found" });
  //       }

  //       res.json(client);
  //     } catch (error) {
  //       res.status(500).json({ message: "Internal server error" });
  //     }
  //   }
}
