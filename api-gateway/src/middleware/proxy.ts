import axios, { AxiosResponse } from "axios";
import { Request, Response, NextFunction } from "express";
import { services, ServiceConfig } from "../config/services";

export class ProxyMiddleware {
  private findTargetService(path: string): ServiceConfig | null {
    return services.find((service) => path.startsWith(service.prefix)) || null;
  }

  private buildTargetUrl(service: ServiceConfig, originalPath: string): string {
    // Extract the service-specific path after the API prefix
    let servicePath = originalPath.replace(service.prefix, "");

    // If the path is empty after removing prefix, don't add anything
    // If the path starts with /, use it as is
    // Otherwise add / before it
    if (!servicePath) {
      servicePath = "";
    } else if (!servicePath.startsWith("/")) {
      servicePath = "/" + servicePath;
    }

    // For orders: /api/orders/123 -> /orders/123
    // For orders: /api/orders -> /orders
    const finalPath =
      service.name === "order-service"
        ? "/orders" + servicePath
        : service.name === "user-service"
        ? "/users" + servicePath
        : servicePath;

    const finalUrl = `${service.url}${finalPath}`;
    console.log(
      `[PROXY DEBUG] Original path: ${originalPath}, Service path: ${servicePath}, Final URL: ${finalUrl}`
    );
    return finalUrl;
  }

  public async proxy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Use originalUrl instead of path to get the full path
      const fullPath = req.originalUrl.split("?")[0]; // Remove query params for routing
      const targetService = this.findTargetService(fullPath);

      console.log(`[PROXY DEBUG] Request: ${req.method} ${fullPath}`);
      console.log(`[PROXY DEBUG] Found service:`, targetService);

      if (!targetService) {
        res.status(404).json({
          error: "Service not found",
          path: fullPath,
          originalUrl: req.originalUrl,
          availableRoutes: services.map((s) => s.prefix),
        });
        return;
      }

      const targetUrl = this.buildTargetUrl(targetService, fullPath);

      console.log(`[PROXY] ${req.method} ${fullPath} -> ${targetUrl}`);
      console.log(`[PROXY DEBUG] Request body:`, req.body);

      const proxyResponse: AxiosResponse = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          host: undefined, // Remove original host header
          "content-length": undefined, // Let axios calculate this
        },
        params: req.query, // Forward query parameters
        timeout: parseInt(process.env.REQUEST_TIMEOUT || "30000"),
        validateStatus: () => true, // Don't throw on HTTP error status codes
      });

      console.log(`[PROXY DEBUG] Response status: ${proxyResponse.status}`);

      // Forward the response
      res.status(proxyResponse.status).json(proxyResponse.data);
    } catch (error: any) {
      console.error(
        `[PROXY ERROR] ${req.method} ${req.originalUrl}:`,
        error.message
      );
      console.error(`[PROXY ERROR] Error code:`, error.code);

      if (error.code === "ECONNREFUSED") {
        res.status(503).json({
          error: "Service unavailable",
          message: `Unable to connect to ${req.originalUrl}`,
          code: "SERVICE_UNAVAILABLE",
        });
      } else {
        res.status(500).json({
          error: "Proxy error",
          message: error.message,
          code: "PROXY_ERROR",
        });
      }
    }
  }
}
