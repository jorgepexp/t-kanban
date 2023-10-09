import { NextFunction, Request, Response } from 'express';
import { HTTPException } from './exceptions';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

export function globalErrorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _: NextFunction
) {
  console.error(JSON.stringify(error, null, 2));

  if (error instanceof HTTPException) {
    response.status(error.status).send({ message: error.message });
    return;
  }

  if (error instanceof PrismaClientValidationError) {
    response.status(400).send();
    return;
  }

  response.status(500).send({ message: 'Internal server error.' });
}
