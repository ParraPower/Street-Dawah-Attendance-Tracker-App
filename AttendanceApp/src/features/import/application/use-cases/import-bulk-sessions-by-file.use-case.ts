import { FileParsingError } from "@attendance/infrastructure/errors/import-errors";
import { CreateBulkSessionsUseCase } from "../../../sessions/application/use-cases/create-bulk-sessions.use-case";
import { CreateBulkSessionsResponseDto } from "../../../sessions/application/dtos/create-bulk-sessions-response.dto";
import { ISessionFileParser } from "../../domain/services/session-file-parser.interface";

export class ImportBulkSessionsByFileUseCase {
  constructor(private readonly fileParserService: ISessionFileParser, private readonly createBulkSessions: CreateBulkSessionsUseCase) {}

  async execute(file: Express.Multer.File): Promise<CreateBulkSessionsResponseDto> {
    try {
      console.log(`📨 Import sessions request received with file: ${file.originalname} (${file.size} bytes)`);
      const sessions = await this.fileParserService.parseFile(file);
      console.log(`✅ File parsed successfully: ${sessions.length} sessions found`);
      return await this.createBulkSessions.execute(sessions);
    } catch (parseErr: any) {
      console.error("❌ Session file parsing error:", parseErr.message);
      throw new FileParsingError(parseErr.message || "Failed to parse sessions file");
    }
  }
}
