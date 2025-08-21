import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Function } from "../entities/Functions";
import { validate } from "class-validator";
import { AppDataSource } from "../config/database";
import { createExternalDatabase } from "../config/createExternalDatabase";
import { Client } from "../entities/Client";

const functionsRepository = AppDataSource.getRepository(Function);
const clientsRepository = AppDataSource.getRepository(Client);

export class FunctionsController {
  async createFunction(req: Request, res: Response) {
    try {
      const functionData = req.body;
      const functionEntity = new Function();
      Object.assign(functionEntity, functionData);

      const errors = await validate(functionEntity);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await functionsRepository.save(functionEntity);
      res.status(201).json(functionEntity);
    } catch (error) {
      console.error("Error creating function:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllFunctions(req: Request, res: Response) {
    try {
      const { IsNull } = require("typeorm");
      const functions = await functionsRepository.find({
        where: { deleted_at: IsNull() },
      });
      res.json(functions);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  
  async getFunctionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const functionEntity = await functionsRepository.findOne({
        where: { id_function: Number(id) },
      });

      if (!functionEntity) {
        return res.status(404).json({ message: "Function not found" });
      }

      res.json(functionEntity);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateFunction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const functionEntity = await functionsRepository.findOne({
        where: { id_function: Number(id) },
      });

      if (!functionEntity) {
        return res.status(404).json({ message: "Function not found" });
      }

      Object.assign(functionEntity, req.body);

      const errors = await validate(functionEntity);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await functionsRepository.save(functionEntity);
      res.json(functionEntity);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteFunction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const functionEntity = await functionsRepository.findOne({
        where: { id_function: Number(id) },
      });

      if (!functionEntity) {
        return res.status(404).json({ message: "Function not found" });
      }

      // Soft delete: apenas marca deleted_at em vez de remover o registro
      functionEntity.deleted_at = new Date();
      await functionsRepository.save(functionEntity);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting function:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async executeQuery(req: Request, res: Response): Promise<Response> {
    try {
      const { query, selectedClinic } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          error: "Query SQL é obrigatória",
        });
      }

      const clinic = await clientsRepository.findOne({ where: { id_cliente: selectedClinic } });

      if (!clinic) {
        return res.status(404).json({
          error: "Clínica não encontrada",
        });
      }

      const dangerousKeywords = [
        "DROP",
        "DELETE",
        "TRUNCATE",
        "ALTER",
        "UPDATE",
      ];
      const upperQuery = query.toUpperCase();

      console.log("Checking query for dangerous keywords...");
      for (const keyword of dangerousKeywords) {
        if (upperQuery.includes(keyword)) {
          console.log(`Blocked keyword found: ${keyword}`);
          return res.status(403).json({
            error: `Operação ${keyword} não é permitida`,
          });
        }
      }

      console.log("Query passed validation, executing...");
      
      const externalDataSource = createExternalDatabase(clinic);
      await externalDataSource.initialize();

      console.log("Database connection established, running query...");
      const result = await externalDataSource.query(query);
      console.log("Query executed successfully, result:", result);

      await externalDataSource.destroy();

      return res.status(200).json({
        success: true,
        data: result,
        // rowCount: Array.isArray(result) ? result.length : 0,
      });
    } catch (error) {
      console.error("Error in executeQuery:", error);
      return res.status(500).json({
        error: "Erro ao executar query",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async executeQueryForAll(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req.body;

      console.log("query is ", query);

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          error: "Query SQL é obrigatória",
        });
      }

      const dangerousKeywords = [
        "DROP",
        "DELETE",
        "TRUNCATE",
        "ALTER",
        "UPDATE",
      ];
      const upperQuery = query.toUpperCase();

      for (const keyword of dangerousKeywords) {
        if (upperQuery.includes(keyword)) {
          return res.status(403).json({
            error: `Operação ${keyword} não é permitida`,
          });
        }
      }

      const clients = (await clientsRepository.find()).filter(
        (client) => client.status === "CONVERTIDO" || client.status === "UPSELL"
      );
      const results = [];

      for (const client of clients) {
        try {
          const externalDataSource = createExternalDatabase(client);
          await externalDataSource.initialize();

          const result = await externalDataSource.query(query);

          await externalDataSource.destroy();

          results.push({
            connection: client.nome_fantasia,
            data: result,
          });
        } catch (connError) {
          results.push({
            connection: client.nome_fantasia,
            error:
              connError instanceof Error ? connError.message : "Unknown error",
          });
        }
       }

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Erro ao executar query",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
