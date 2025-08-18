import axios from "axios";
import { services, ServiceConfig } from "../config/services";
import { ServiceHealth } from "../types";

export class HealthChecker {
  private healthStatus: Map<string, ServiceHealth> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(private intervalMs: number = 30000) {
    this.initializeHealthStatus();
  }

  private initializeHealthStatus(): void {
    services.forEach((service) => {
      this.healthStatus.set(service.name, {
        service: service.name,
        status: "unhealthy",
        url: service.url,
        responseTime: 0,
      });
    });
  }

  public async checkServiceHealth(
    service: ServiceConfig
  ): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      const response = await axios.get(`${service.url}${service.healthCheck}`, {
        timeout: 5000,
        validateStatus: (status) => status < 500,
      });

      const responseTime = Date.now() - startTime;
      const healthStatus: ServiceHealth = {
        service: service.name,
        status: response.status < 400 ? "healthy" : "unhealthy",
        url: service.url,
        responseTime,
      };

      this.healthStatus.set(service.name, healthStatus);
      return healthStatus;
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const healthStatus: ServiceHealth = {
        service: service.name,
        status: "unhealthy",
        url: service.url,
        responseTime,
      };

      this.healthStatus.set(service.name, healthStatus);
      console.warn(
        `[HEALTH CHECK] ${service.name} is unhealthy: ${error.message}`
      );
      return healthStatus;
    }
  }

  public async checkAllServices(): Promise<ServiceHealth[]> {
    const healthChecks = services.map((service) =>
      this.checkServiceHealth(service)
    );
    return Promise.all(healthChecks);
  }

  public getServiceHealth(serviceName: string): ServiceHealth | undefined {
    return this.healthStatus.get(serviceName);
  }

  public getAllServicesHealth(): ServiceHealth[] {
    return Array.from(this.healthStatus.values());
  }

  public isServiceHealthy(serviceName: string): boolean {
    const health = this.healthStatus.get(serviceName);
    return health?.status === "healthy";
  }

  public startPeriodicHealthChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Initial health check
    this.checkAllServices();

    // Set up periodic checks
    this.checkInterval = setInterval(async () => {
      await this.checkAllServices();
      console.log(`[HEALTH CHECK] Completed health check cycle`);
    }, this.intervalMs);

    console.log(
      `[HEALTH CHECK] Started periodic health checks every ${this.intervalMs}ms`
    );
  }

  public stopPeriodicHealthChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log("[HEALTH CHECK] Stopped periodic health checks");
    }
  }
}
