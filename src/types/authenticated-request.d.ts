import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    username: string;
  };
}

export interface JwtPayload {
  sub: number;
  username: string;
}
