import { FileParsingError } from "@attendance/infrastructure/errors/import-errors";
import { CreateBulkMembershipsUseCase } from "../../../memberships/application/use-cases/create-bulk-memberships.use-case";
import { CreateBulkMembershipsResponseDto } from "../../../memberships/application/dtos/create-bulk-memberships-response.dto";
import { IMembershipFileParser } from "../../domain/services/membership-file-parser.interface";

export class ImportBulkMembershipsByFileUseCase {
  constructor(private readonly fileParserService: IMembershipFileParser, private readonly createBulkMemberships: CreateBulkMembershipsUseCase) {}

  async execute(file: Express.Multer.File): Promise<CreateBulkMembershipsResponseDto> {
    try {
      console.log(`📨 Import memberships request received with file: ${file.originalname} (${file.size} bytes)`);
      const memberships = await this.fileParserService.parseFile(file);
      console.log(`✅ File parsed successfully: ${memberships.length} memberships found`);
      return await this.createBulkMemberships.execute(memberships);
    } catch (parseErr: any) {
      console.error("❌ Membership file parsing error:", parseErr.message);
      throw new FileParsingError(parseErr.message || "Failed to parse memberships file");
    }
  }
}
