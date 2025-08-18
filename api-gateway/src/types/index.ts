export interface ProxyRequest {
  method: string;
  url: string;
  headers: any;
  body?: any;
}

export interface ProxyResponse {
  status: number;
  data: any;
  headers?: any;
}

export interface ServiceHealth {
  service: string;
  status: "healthy" | "unhealthy";
  url: string;
  responseTime?: number;
}
