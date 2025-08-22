import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  async register(req: Request, res: Response): Promise<Response | void> {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = hashedPassword;

      // Validate user
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await userRepository.save(user);

      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      console.log("Login attempt:", req.body);

      const { email, password } = req.body;

      // Find user
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "24h" }
      );

      // Remove password from response
      const { password: _, ...userResponse } = user;
      console.log("Login successful for user:", user.email);
      res.json({ success: true, user: userResponse, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<Response | void> {
    try {
      const users = await userRepository.find({
        select: ["id", "name", "email", "created_at", "updated_at"],
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        select: ["id", "name", "email", "created_at", "updated_at"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await userRepository.findOne({
        where: { id: parseInt(id) },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name || user.name;
      user.email = email || user.email;

      if (password) {
        // Hash the new password before saving
        user.password = await bcrypt.hash(password, 10);
      }

      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await userRepository.save(user);

      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const result = await userRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
