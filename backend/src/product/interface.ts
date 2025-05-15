import { Request } from "express";

export interface getData extends Request {
    user: any,
    role: string,
  }