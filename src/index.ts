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

// CORS configuration
app.use(
  cors({
    origin: [
      "https://frontpgo.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  })
);

app.use(express.json());

// Health check route - DEVE vir antes das outras rotas
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Add your routes here
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/functions", functionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Initialize database and start server
const PORT = Number(process.env.PORT) || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
    // Ainda assim inicie o servidor para o health check funcionar
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT} (without database)`);
    });
  });
