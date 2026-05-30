import ExcelJS from "exceljs";
import { ImportRowRequestDto } from "../../application/dtos/import-user-request.dto";
import { IFileParser } from "../../application/interfaces/file-parser.interface";

/**
 * Unified file parser service supporting Excel and CSV formats
 * Parses files with the structure defined in ImportRow entity
 * Implements IFileParser interface
 */
export class UserFileParserService implements IFileParser {
  private readonly CURRENT_MEMBERS_SHEET = "Current";

  /**
   * Parse xlsx or csv file and extract import data
   * @param file The uploaded file with buffer data
   * @returns Promise resolving to array of ImportRowRequestDto objects
   * @throws Error if file format is unsupported or parsing fails
   */
  async parseFile(file: Express.Multer.File): Promise<ImportRowRequestDto[]> {
    if (!file) {
      throw new Error("No file provided");
    }

    const mimeType = file.mimetype;
    const fileName = file.originalname.toLowerCase();

    // Check if file is xlsx
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      return await this.parseExcelFileWithExcelJS(file.buffer);
    }

    // Check if file is csv
    if (
      mimeType === "text/csv" ||
      mimeType === "application/csv" ||
      fileName.endsWith(".csv")
    ) {
      return this.parseCsvFile(file.buffer);
    }

    throw new Error(
      `Unsupported file format. Please provide .xlsx, .xls, or .csv file. Received: ${mimeType || fileName}`
    );
  }

  /**
   * Parse Excel file using ExcelJS
   * Expects columns in this order:
   * A: Name, B: Number, C: WhatsappLink, D: JoinedDate, E: Reference,
   * F: LastAttendance, G: LastAttendedBefore60Days, H: Location, I: RegularLocation,
   * J: Status, K: OutreachDate, L: WhoReachedOut, M: Socials, N: University, O: Outcome
   */
  private async parseExcelFileWithExcelJS(buffer: Buffer): Promise<ImportRowRequestDto[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);

      // Try to get the sheet (default to first sheet if specific sheets not found)
      let worksheet = workbook.getWorksheet(this.CURRENT_MEMBERS_SHEET);
      if (!worksheet) {
        worksheet = workbook.worksheets[0];
      }

      if (!worksheet) {
        throw new Error("No sheets found in the Excel file");
      }

      const rows: ImportRowRequestDto[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        const dto = new ImportRowRequestDto();

        // Map cells to fields based on ImportRow structure
        dto.name = this.getCellValue(row.getCell(1));
        dto.number = this.getCellValue(row.getCell(2));
        dto.whatsappLink = this.getCellValue(row.getCell(3));
        dto.joinedDate = this.getCellDateValue(row.getCell(4));
        dto.reference = this.getCellValue(row.getCell(5));
        dto.lastAttendance = this.getCellDateValue(row.getCell(6));
        dto.lastAttendedBefore60Days = this.getCellValue(row.getCell(7));
        dto.location = this.getCellValue(row.getCell(8));
        dto.regularLocation = this.getCellValue(row.getCell(9));
        dto.status = this.getCellValue(row.getCell(10));
        dto.outreachDate = this.getCellValue(row.getCell(11));
        dto.whoReachedOut = this.getCellValue(row.getCell(12));
        dto.socials = this.getCellBooleanValue(row.getCell(13));
        dto.university = this.getCellBooleanValue(row.getCell(14));
        dto.outcome = this.getCellValue(row.getCell(15));

        rows.push(dto);
      });

      if (rows.length === 0) {
        throw new Error("No data found in the Excel sheet");
      }

      return rows;
    } catch (error: any) {
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  /**
   * Parse CSV file
   * Expects header row with column names, then data rows
   * Supports flexible column naming (camelCase, PascalCase, snake_case)
   */
  private parseCsvFile(buffer: Buffer): ImportRowRequestDto[] {
    try {
      const csvText = buffer.toString("utf-8");
      const lines = csvText.trim().split("\n");

      if (lines.length < 2) {
        throw new Error("CSV file must have at least a header row and one data row");
      }

      // Parse header
      const headerLine = lines[0];
      const headers = this.parseCSVLine(headerLine).map((h) => h.toLowerCase().trim());

      // Parse data rows
      const data: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = this.parseCSVLine(line);
        const row: any = {};

        headers.forEach((header, index) => {
          if (index < values.length) {
            row[header] = values[index].trim();
          }
        });

        data.push(row);
      }

      if (data.length === 0) {
        throw new Error("No data rows found in CSV file");
      }

      return this.mapCsvDataToRowDtos(data);
    } catch (error: any) {
      throw new Error(`Failed to parse CSV file: ${error.message}`);
    }
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Map CSV data to ImportRowRequestDto array
   */
  private mapCsvDataToRowDtos(data: any[]): ImportRowRequestDto[] {
    return data.map((row) => {
      const dto = new ImportRowRequestDto();
      // Support flexible column naming (camelCase, PascalCase, snake_case)
      dto.name = this.normalizeField(row.name || row.Name);
      dto.number = this.normalizeField(row.number || row.Number);
      dto.whatsappLink = this.normalizeField(row.whatsapplink || row.whatsappLink || row.WhatsappLink);
      dto.joinedDate = this.parseDate(row.joineddate || row.joinedDate || row.JoinedDate);
      dto.reference = this.normalizeField(row.reference || row.Reference);
      dto.lastAttendance = this.parseDate(row.lastattendance || row.lastAttendance || row.LastAttendance);
      dto.lastAttendedBefore60Days = this.normalizeField(row.lastattendedBefore60Days || row.LastAttendedBefore60Days);
      dto.location = this.normalizeField(row.location || row.Location);
      dto.regularLocation = this.normalizeField(row.regularlocation || row.regularLocation || row.RegularLocation);
      dto.status = this.normalizeField(row.status || row.Status);
      dto.outreachDate = this.normalizeField(row.outreachdate || row.outreachDate || row.OutreachDate);
      dto.whoReachedOut = this.normalizeField(row.whoreachedout || row.whoReachedOut || row.WhoReachedOut);
      dto.socials = this.parseBoolean(row.socials || row.Socials);
      dto.university = this.parseBoolean(row.university || row.University);
      dto.outcome = this.normalizeField(row.outcome || row.Outcome);
      return dto;
    });
  }

  /**
   * Get cell value, handling null/undefined
   */
  private getCellValue(cell: ExcelJS.Cell): string | undefined {
    const value = cell.value;
    if (value === null || value === undefined) {
      return undefined;
    }
    return String(value).trim() || undefined;
  }

  /**
   * Get cell date value
   */
  private getCellDateValue(cell: ExcelJS.Cell): Date | undefined {
    const value = cell.value;
    if (value instanceof Date) {
      return value;
    }
    if (!value) {
      return undefined;
    }
    try {
      const parsed = new Date(value as any);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  }

  /**
   * Get cell boolean value from Yes/No or true/false
   */
  private getCellBooleanValue(cell: ExcelJS.Cell): boolean | null {
    const value = cell.value;
    if (value === null || value === undefined) {
      return null;
    }
    const str = String(value).toLowerCase().trim();
    if (str === "yes" || str === "true" || str === "1") {
      return true;
    }
    if (str === "no" || str === "false" || str === "0") {
      return false;
    }
    return null;
  }

  /**
   * Normalize field value (trim and handle empty strings)
   */
  private normalizeField(value: any): string | undefined {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || undefined;
    }
    if (value === null || value === undefined) {
      return undefined;
    }
    return String(value).trim() || undefined;
  }

  /**
   * Parse date from string or Date object
   */
  private parseDate(value: any): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    try {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  }

  /**
   * Parse boolean from Yes/No or true/false strings
   */
  private parseBoolean(value: any): boolean | null {
    if (value === null || value === undefined) {
      return null;
    }
    const str = String(value).toLowerCase().trim();
    if (str === "yes" || str === "true" || str === "1") {
      return true;
    }
    if (str === "no" || str === "false" || str === "0") {
      return false;
    }
    return null;
  }
}
