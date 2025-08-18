import { Request } from "express";

export interface User {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface RoutePermission {
  path: string;
  methods: string[];
  requiredRoles?: string[];
  requiredPermissions?: string[];
  public?: boolean;
}
