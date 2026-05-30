export abstract class GlobalError {
  constructor(message: string);
  constructor(message: string, data?: object);
  constructor(message: string, data?: object) {
    this.message = message;
    this.data = data;
  }

  data?: object;
  message!: string;
}

export type ErrorHandlerEntry = {
  errorClass: new (...args: any[]) => GlobalError;
  statusCode: number;
  formatter?: (err: GlobalError) => object;
};

export class ValidationError extends GlobalError {}
export class NotFoundError extends GlobalError {}
export class UnauthorizedError extends GlobalError {}
export class ConflictError extends GlobalError {}