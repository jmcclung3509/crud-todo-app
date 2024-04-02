import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import ErrorResponse from './interfaces/ErrorResponse';
import  RequestValidators  from './interfaces/RequestValidators';



export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}


//validate response
export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      next(); // Call next middleware if validation succeeds
    } catch (error) {
      if (error instanceof ZodError) {
        // If validation fails due to ZodError, send 422 status and error details to client
        res.status(422).json({ message: 'Validation failed', errors: error.errors });
      } else {
        // If validation fails due to other errors, pass the error to the Express error handler
        next(error);
      }
    }
  };
}