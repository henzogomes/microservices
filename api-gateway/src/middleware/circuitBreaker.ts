import { Request, Response, NextFunction } from "express";
import { HealthChecker } from "../services/healthChecker";

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
}

export class CircuitBreakerMiddleware {
  private circuitStates: Map<string, "CLOSED" | "OPEN" | "HALF_OPEN"> =
    new Map();
  private failureCounts: Map<string, number> = new Map();
  private lastFailureTime: Map<string, number> = new Map();

  constructor(
    private healthChecker: HealthChecker,
    private config: CircuitBreakerConfig = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
    }
  ) {}

  private getServiceNameFromPath(path: string): string | null {
    if (path.startsWith("/api/users")) return "user-service";
    if (path.startsWith("/api/orders")) return "order-service";
    return null;
  }

  private isCircuitOpen(serviceName: string): boolean {
    const state = this.circuitStates.get(serviceName) || "CLOSED";
    const failureCount = this.failureCounts.get(serviceName) || 0;
    const lastFailure = this.lastFailureTime.get(serviceName) || 0;

    // Check if we should reset from OPEN to HALF_OPEN
    if (
      state === "OPEN" &&
      Date.now() - lastFailure > this.config.resetTimeout
    ) {
      this.circuitStates.set(serviceName, "HALF_OPEN");
      console.log(
        `[CIRCUIT BREAKER] ${serviceName} circuit moved to HALF_OPEN`
      );
      return false;
    }

    return state === "OPEN";
  }

  private recordSuccess(serviceName: string): void {
    this.failureCounts.set(serviceName, 0);
    this.circuitStates.set(serviceName, "CLOSED");
  }

  private recordFailure(serviceName: string): void {
    const currentFailures = this.failureCounts.get(serviceName) || 0;
    const newFailures = currentFailures + 1;

    this.failureCounts.set(serviceName, newFailures);
    this.lastFailureTime.set(serviceName, Date.now());

    if (newFailures >= this.config.failureThreshold) {
      this.circuitStates.set(serviceName, "OPEN");
      console.warn(
        `[CIRCUIT BREAKER] ${serviceName} circuit OPENED after ${newFailures} failures`
      );
    }
  }

  public checkCircuit(req: Request, res: Response, next: NextFunction): void {
    // Use originalUrl to get the full path
    const fullPath = req.originalUrl.split("?")[0];
    const serviceName = this.getServiceNameFromPath(fullPath);

    if (!serviceName) {
      next();
      return;
    }

    // Check if circuit is open
    if (this.isCircuitOpen(serviceName)) {
      res.status(503).json({
        error: "Service temporarily unavailable",
        message: `${serviceName} is currently unavailable due to repeated failures`,
        code: "CIRCUIT_BREAKER_OPEN",
        retryAfter: Math.ceil(this.config.resetTimeout / 1000),
      });
      return;
    }

    // Store reference to circuit breaker instance
    const circuitBreaker = this;

    // Add success/failure tracking to response
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      if (res.statusCode < 500) {
        // Success or client error (not server error)
        circuitBreaker.recordSuccess(serviceName);
      } else {
        // Server error
        circuitBreaker.recordFailure(serviceName);
      }
      return originalJson(data);
    };

    next();
  }

  public getCircuitStatus(): any {
    const status: any = {};

    for (const [serviceName] of this.circuitStates) {
      status[serviceName] = {
        state: this.circuitStates.get(serviceName) || "CLOSED",
        failureCount: this.failureCounts.get(serviceName) || 0,
        lastFailure: this.lastFailureTime.get(serviceName) || null,
        isHealthy: this.healthChecker.isServiceHealthy(serviceName),
      };
    }

    return status;
  }
}
