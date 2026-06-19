import { ImportRowRequestDto } from "../../application/dtos/import-user-request.dto";

/**
 * Interface defining the contract for file parsing services
 * Supports parsing of various file formats (Excel, CSV) into standardized ImportRowRequestDto objects
 */
export interface IFileParser {
  /**
   * Parse a file and extract import row data
   * @param file The uploaded file with buffer data
   * @returns Promise resolving to array of parsed import rows
   * @throws Error if file format is unsupported or parsing fails
   */
  parseFile(file: Express.Multer.File): Promise<ImportRowRequestDto[]>;
}
