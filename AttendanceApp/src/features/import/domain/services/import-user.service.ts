import { NormalizedImportUserRequestDto } from "../../application/dtos/import-user-request.dto";
import { ImportUsersBulkResponseDto } from "../../application/dtos/import-user-response.dto";

export interface IImportUserService {
  importUsers(users: NormalizedImportUserRequestDto[], authToken?: string): Promise<ImportUsersBulkResponseDto>;
}