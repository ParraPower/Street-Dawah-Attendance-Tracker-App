import { FileParsingError, FileUploadError, ImportUsersError, NoFileProvidedError, UploadFileError, } from "@attendance/infrastructure/errors/import-errors";
import { ErrorHandlerEntry } from "app-framework";

export const registerImportErrors = (): ErrorHandlerEntry[] => [
  { errorClass: FileParsingError, statusCode: 400 },
  { errorClass: FileUploadError, statusCode: 400 },
  { errorClass: ImportUsersError, statusCode: 500 },
  { errorClass: NoFileProvidedError, statusCode: 400 },
  { errorClass: UploadFileError, statusCode: 400 },
]