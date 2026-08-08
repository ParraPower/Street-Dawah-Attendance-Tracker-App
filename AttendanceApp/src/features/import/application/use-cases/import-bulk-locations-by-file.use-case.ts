import { CreateBulkLocationsUseCase } from "../../../locations/application/use-cases/create-bulk-locations.use-case";
import { CreateBulkLocationsResponseDto } from "../../../locations/application/dtos/create-bulk-locations-response.dto";
import { FileParsingError } from "@attendance/infrastructure/errors/import-errors";
import { ILocationFileParser } from "../../domain/services/location-file-parser.interface";

export class ImportBulkLocationsByFileUseCase {
  constructor(
    private readonly fileParserService: ILocationFileParser,
    private readonly createBulkLocations: CreateBulkLocationsUseCase
  ) {}

  async execute(file: Express.Multer.File): Promise<CreateBulkLocationsResponseDto> {
    try {
      console.log(`📨 Import locations request received with file: ${file.originalname} (${file.size} bytes)`);
      const locations = await this.fileParserService.parseFile(file);
      console.log(`✅ File parsed successfully: ${locations.length} locations found`);
      return await this.createBulkLocations.execute(locations);
    } catch (parseErr: any) {
      console.error("❌ Location file parsing error:", parseErr.message);
      throw new FileParsingError(parseErr.message || "Failed to parse locations file");
    }
  }
}