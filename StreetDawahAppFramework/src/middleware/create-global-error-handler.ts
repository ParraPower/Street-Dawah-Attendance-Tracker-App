import { NextFunction, Response } from 'express';
import { ErrorHandlerEntry, GlobalError } from "@shared/errors/types";
import { globalErrorHandler } from "./global-error-handler";


export function createGlobalErrorHandler(customErrors?: ErrorHandlerEntry[]) {
  return (err: GlobalError, req: any, res: Response, next: NextFunction) => {
    // Check custom errors first (app-specific)
    if (customErrors) {
      for (const { errorClass, statusCode, formatter } of customErrors) {
        if (err instanceof errorClass) {
          const body = formatter ? formatter(err) : { error: err.message, data: err.data };
          return res.status(statusCode).json(body);
        }
      }
    }

    // Fall back to base framework errors
    return globalErrorHandler(err, req, res, next);
  };
}