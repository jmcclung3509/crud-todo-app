import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import ErrorResponse from './interfaces/ErrorResponse';
import  RequestValidators  from './interfaces/RequestValidators';
import { ParamsWithId } from './interfaces/ParamsWithId';



export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}



export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request parameters
      if (validators.params) {
        console.log('validators.params');
        // If the endpoint expects an id parameter, use the ParamsWithId schema to validate it
        if (validators.params === ParamsWithId) {
          console.log('validators.params === ParamsWithId')
          // Validate the id parameter using ParamsWithId schema
          req.params = await ParamsWithId.parseAsync(req.params);
        } else {
          console.log('validators.params !== ParamsWithId')
          // If no specific schema is provided for params, use the general params schema
          req.params = await validators.params.parseAsync(req.params);
        }
      }
      // Validate request body
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      // Validate query parameters
      // if (validators.query) {
      //   req.query = await validators.query.parseAsync(req.query);
      // }
      // Call next middleware if validation succeeds
      next();
    } catch (error) {
      // Handle validation errors
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