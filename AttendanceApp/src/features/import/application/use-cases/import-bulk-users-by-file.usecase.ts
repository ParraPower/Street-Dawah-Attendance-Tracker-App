import { ImportUsersRequestDto } from "../dtos/import-user-request.dto";
import { ImportUsersUseCase } from "./import-users.usecase";
import { ImportUsersBulkResponseDto } from "../dtos";
import { FileParsingError } from "@attendance/infrastructure/errors/import-errors";
import { IFileParser } from "../../domain/services/file-parser.interface";

export class ImportBulkUsersByFileUseCase {
  constructor(
    private fileParserService: IFileParser,
    private importUsersUseCase: ImportUsersUseCase
  ) { }
  async execute(file: Express.Multer.File): Promise<ImportUsersBulkResponseDto> {
    try {
      console.log(
        `📨 Import users request received with file: ${file.originalname} (${file.size} bytes)`
      );

      // Parse the file (now async)
      const parsedUsers = await this.fileParserService.parseFile(file);
      console.log(`✅ File parsed successfully: ${parsedUsers.length} users found`);

      // Create the DTO and execute the use case
      const requestDto = new ImportUsersRequestDto();
      requestDto.users = parsedUsers;

      const result = await this.importUsersUseCase.execute(requestDto);
      console.log(`📊 Import users completed: ${result.createdUsers.length} created, ${result.omittedUsers.length} omitted, ${result.errors?.length || 0} errors`)
      return result;
    } catch (parseErr: any) {
      console.error("❌ File parsing error:", parseErr.message, parseErr.stack);
      // #TODO: create custom error class for file parsing error
      // const fileParsingError = new FileParsingError(parseErr.message);
      throw new FileParsingError(parseErr.message || "Failed to parse file");
    }
  }
}