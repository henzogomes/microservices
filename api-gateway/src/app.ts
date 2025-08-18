import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { ProxyMiddleware } from "./middleware/proxy";
import { services } from "./config/services";
import { HealthChecker } from "./services/healthChecker";
import { CircuitBreakerMiddleware } from "./middleware/circuitBreaker";
import { createMonitoringRoutes } from "./routes/monitoring";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize health checker and circuit breaker
const healthChecker = new HealthChecker(30000); // Check every 30 seconds
const circuitBreaker = new CircuitBreakerMiddleware(healthChecker);

// Start health monitoring
healthChecker.startPeriodicHealthChecks();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

// Rate limiting with environment variables
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    message: "Rate limit exceeded. Please try again later.",
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    services: services.map((service) => ({
      name: service.name,
      prefix: service.prefix,
      url: service.url,
    })),
  });
});

// Gateway info endpoint
app.get("/gateway/info", (req, res) => {
  res.json({
    name: "API Gateway",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    services: services.map((service) => ({
      name: service.name,
      prefix: service.prefix,
      healthCheck: `${service.url}${service.healthCheck}`,
    })),
    endpoints: {
      health: "/health",
      info: "/gateway/info",
      monitoring: "/monitoring/dashboard",
      serviceHealth: "/health/services",
      circuits: "/health/circuits",
    },
  });
});

// Monitoring routes
app.use("/", createMonitoringRoutes(healthChecker, circuitBreaker));

// Initialize proxy middleware
const proxyMiddleware = new ProxyMiddleware();

// Route all API requests through circuit breaker and proxy
app.use(
  "/api/*",
  (req, res, next) => circuitBreaker.checkCircuit(req, res, next),
  (req, res, next) => proxyMiddleware.proxy(req, res, next)
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    message: "The requested endpoint does not exist",
    availableRoutes: [
      "/health",
      "/gateway/info",
      "/monitoring/dashboard",
      "/health/services",
      "/health/circuits",
      ...services.map((s) => s.prefix),
    ],
  });
});

// Error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("[ERROR]", error);
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  healthChecker.stopPeriodicHealthChecks();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  healthChecker.stopPeriodicHealthChecks();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`ℹ️  Gateway info: http://localhost:${PORT}/gateway/info`);
  console.log(`📈 Monitoring: http://localhost:${PORT}/monitoring/dashboard`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("\n📡 Configured services:");
  services.forEach((service) => {
    console.log(`  • ${service.name}: ${service.prefix} -> ${service.url}`);
  });
});

export default app;
