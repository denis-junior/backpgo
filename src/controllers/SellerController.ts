import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Seller } from "../entities/Seller";
import { validate } from "class-validator";
import { IsNull } from "typeorm";
import { isNull } from "util";

const sellerRepository = AppDataSource.getRepository(Seller);

export class SellerController {
  async createSeller(req: Request, res: Response) {
    try {
      const sellerData = req.body;
      const seller = new Seller();
      Object.assign(seller, sellerData);

      const errors = await validate(seller);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await sellerRepository.save(seller);
      res.status(201).json(seller);
    } catch (error) {
      console.error("Error creating seller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllSellers(req: Request, res: Response) {
    try {
      const { IsNull } = require("typeorm");
      const sellers = await sellerRepository.find({
        where: { deleted_at: IsNull() },
      });
      res.json(sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getSellerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const seller = await sellerRepository.findOne({
        where: { id: parseInt(id), deleted_at: IsNull() },
      });

      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      res.json(seller);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateSeller(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const seller = await sellerRepository.findOne({
        where: { id: parseInt(id), deleted_at: IsNull() },
      });

      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      Object.assign(seller, updateData);

      const errors = await validate(seller);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await sellerRepository.save(seller);
      res.json(seller);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteSeller(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const seller = await sellerRepository.findOne({
        where: { id: parseInt(id), deleted_at: IsNull() },
      });

      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      seller.deleted_at = new Date();
      await sellerRepository.save(seller);

      res.json({ message: "Seller deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
