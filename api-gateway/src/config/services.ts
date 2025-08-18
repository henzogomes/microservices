export interface ServiceConfig {
  name: string;
  url: string;
  prefix: string;
  healthCheck: string;
}

export const services: ServiceConfig[] = [
  {
    name: "user-service",
    url: process.env.USER_SERVICE_URL || "http://localhost:3000",
    prefix: "/api/users",
    healthCheck: "/health",
  },
  {
    name: "order-service",
    url: process.env.ORDER_SERVICE_URL || "http://localhost:3001",
    prefix: "/api/orders",
    healthCheck: "/health",
  },
];
