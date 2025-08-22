import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Client } from "../entities/Client";
import { validate } from "class-validator";
import { IsNull } from "typeorm";
import { isNull } from "util";

const clientRepository = AppDataSource.getRepository(Client);

enum StatusCategory {
  LEAD = "LEAD",
  PROPOSTA = "PROPOSTA",
  CONTRATO = "CONTRATO",
  CONVERTIDO = "CONVERTIDO",
  EM_NEGOCIACAO = "EM NEGOCIACAO",
}

export class ContractController {

  async updateStatusContract(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const client = await clientRepository.findOne({
        where: { id_cliente: parseInt(id), deleted_at: IsNull() },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      Object.assign(client, {
        ...client,
        status: updateData.status,
        categoria: updateData.categoria,
      });

      const errors = await validate(client);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await clientRepository.save(client);
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async signContract(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;

      const client = await clientRepository.findOne({
        where: { id_cliente: parseInt(id), deleted_at: IsNull() },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      Object.assign(client, {
        ...client,
        status: "CONVERTIDO",
        categoria: "CONTRATO",
        is_signed: true
      });

      const errors = await validate(client);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await clientRepository.save(client);
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async acceptProposal(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;

      const client = await clientRepository.findOne({
        where: { id_cliente: parseInt(id), deleted_at: IsNull() },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      Object.assign(client, {
        ...client,
        status: StatusCategory.EM_NEGOCIACAO
      });

      const errors = await validate(client);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await clientRepository.save(client);
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  //   async deleteClient(req: Request, res: Response) {
  //     try {
  //       const { id } = req.params;
  //       const client = await clientRepository.findOne({
  //         where: { id_cliente: parseInt(id), deleted_at: IsNull() },
  //       });

  //       if (!client) {
  //         return res.status(404).json({ message: "Client not found" });
  //       }

  //       // Soft delete
  //       client.deleted_at = new Date();
  //       await clientRepository.save(client);

  //       res.json({ message: "Client deleted successfully" });
  //     } catch (error) {
  //       res.status(500).json({ message: "Internal server error" });
  //     }
  //   }
}
