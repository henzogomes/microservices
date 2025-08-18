import { Router } from "express";
import { HealthChecker } from "../services/healthChecker";
import { CircuitBreakerMiddleware } from "../middleware/circuitBreaker";

export function createMonitoringRoutes(
  healthChecker: HealthChecker,
  circuitBreaker: CircuitBreakerMiddleware
): Router {
  const router = Router();

  // Detailed health check for all services
  router.get("/health/services", async (req, res) => {
    try {
      const healthChecks = await healthChecker.checkAllServices();
      const overallStatus = healthChecks.every((h) => h.status === "healthy")
        ? "healthy"
        : "degraded";

      res.json({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        services: healthChecks,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  });

  // Circuit breaker status
  router.get("/health/circuits", (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      circuits: circuitBreaker.getCircuitStatus(),
    });
  });

  // Combined monitoring dashboard data
  router.get("/monitoring/dashboard", async (req, res) => {
    try {
      const healthChecks = await healthChecker.checkAllServices();
      const circuitStatus = circuitBreaker.getCircuitStatus();

      res.json({
        timestamp: new Date().toISOString(),
        services: healthChecks,
        circuits: circuitStatus,
        summary: {
          totalServices: healthChecks.length,
          healthyServices: healthChecks.filter((h) => h.status === "healthy")
            .length,
          openCircuits: Object.values(circuitStatus).filter(
            (c: any) => c.state === "OPEN"
          ).length,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch monitoring data",
        message: error.message,
      });
    }
  });

  return router;
}
