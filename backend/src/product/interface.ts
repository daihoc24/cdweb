import { Request } from "express";

export interface getData extends Request {
  user: {
    id: number;
    role: string;
  }
}