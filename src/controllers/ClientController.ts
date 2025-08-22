import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Client } from "../entities/Client";
import { validate } from "class-validator";
import { IsNull } from "typeorm";

const clientRepository = AppDataSource.getRepository(Client);

export class ClientController {
  async createClient(req: Request, res: Response): Promise<Response | void> {
    try {
      const clientData = req.body;
      const client = new Client();
      Object.assign(client, clientData);

      const errors = await validate(client);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await clientRepository.save(client);
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllClients(req: Request, res: Response): Promise<Response | void> {
    try {
      const clients = await clientRepository.find({
        where: { deleted_at: IsNull() },
      });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getClientById(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const client = await clientRepository.findOne({
        where: { id_cliente: parseInt(id), deleted_at: IsNull() },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateClient(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const client = await clientRepository.findOne({
        where: { id_cliente: parseInt(id), deleted_at: IsNull() },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      Object.assign(client, updateData);

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

  async deleteClient(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const client = await clientRepository.findOne({
        where: { id_cliente: parseInt(id), deleted_at: IsNull() },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // Soft delete
      client.deleted_at = new Date();
      await clientRepository.save(client);

      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
