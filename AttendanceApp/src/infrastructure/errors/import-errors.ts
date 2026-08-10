import { GlobalError } from 'app-framework'
export class FileUploadError extends GlobalError {
    constructor(message: string) {
        super(message);
    }
}
export class ImportUsersError extends GlobalError {
    constructor(message: string) {
        super(message);
    }
}
export class FileParsingError extends GlobalError {
    constructor(message: string) {
        super(message);
    }
}

export class NoFileProvidedError extends GlobalError {
  constructor(message: string) {
    super(message);
  }
}

export class UploadFileError extends GlobalError {
  constructor(message: string) {
    super(message);
  }
}