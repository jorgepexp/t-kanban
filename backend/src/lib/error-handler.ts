import { NextFunction, Request, Response } from 'express';
import { HTTPException } from './exceptions';

export function globalErrorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _: NextFunction
) {
  console.error(error);

  if (error instanceof HTTPException) {
    response.status(error.status).send({ message: error.message });
    return;
  }

  response.status(500).send({ meessage: 'Internal server error.' });
}
