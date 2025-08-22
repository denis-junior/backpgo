import "reflect-metadata";
import dotenv from "dotenv";

// Carregar variáveis de ambiente antes de importar outros módulos
dotenv.config();

import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import clientRoutes from "./routes/clientRoutes";
import userRoutes from "./routes/userRoutes";
import sellerRoutes from "./routes/sellerRoutes";
import contractRoutes from "./routes/contractRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import functionRoutes from "./routes/functionRoutes";

const app = express();
const PORT = process.env.PORT || 3000;
// CORS configuration
const corsOptions = {
  origin: [
    "https://frontpgo.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/functions", functionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
