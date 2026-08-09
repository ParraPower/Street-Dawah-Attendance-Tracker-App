import { FileParsingError } from "@attendance/infrastructure/errors/import-errors";
import { CreateBulkUserMembershipsUseCase } from "../../../user-memberships/application/use-cases/create-bulk-user-memberships.use-case";
import { UserMembershipDto } from "../../../user-memberships/application/dtos/user-membership.dto";
import { IUserMembershipFileParser } from "../../domain/services/user-membership-file-parser.interface";

export class ImportBulkUserMembershipsByFileUseCase {
  constructor(private readonly fileParserService: IUserMembershipFileParser, private readonly createBulkUserMemberships: CreateBulkUserMembershipsUseCase) {}

  async execute(file: Express.Multer.File): Promise<UserMembershipDto[]> {
    try {
      console.log(`📨 Import user-memberships request received with file: ${file.originalname} (${file.size} bytes)`);
      const userMemberships = await this.fileParserService.parseFile(file);
      console.log(`✅ File parsed successfully: ${userMemberships.length} user-memberships found`);
      return await this.createBulkUserMemberships.execute(userMemberships);
    } catch (parseErr: any) {
      console.error("❌ User-membership file parsing error:", parseErr.message);
      throw new FileParsingError(parseErr.message || "Failed to parse user-memberships file");
    }
  }
}
