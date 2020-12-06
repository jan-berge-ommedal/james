import { Request, Response } from 'express';

export default function (request: Request, response: Response, next: Function) {
  console.log(`${request.method} ${request.path}`);
  next();
}