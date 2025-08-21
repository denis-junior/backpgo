import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import userRoutes from "./routes/userRoutes";
import clientRoutes from "./routes/clientRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import sellerRoutes from "./routes/sellerRoutes";
import contractRoutes from "./routes/contractRoutes";
import functionRoutes from "./routes/functionRoutes";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/functions", functionRoutes);

app.get("/api/getCnpjApi/:cnpj", async (req, res) => {
  const cnpj = req.params.cnpj;
  try {
    const response = await axios.get(
      `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching CNPJ data:", error);
    if (axios.isAxiosError(error) && error.response) {
      return res
        .status(error.response.status)
        .json({ error: "Failed to fetch CNPJ data" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
