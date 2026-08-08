import ExcelJS from "exceljs";
import { ImportRowRequestDto } from "../../features/import/application/dtos/import-user-request.dto";
import { IFileParser } from "../../features/import/domain/services/file-parser.interface";

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
   * Expects columns in this order (matching ImportRowRequestDto):
   * A: Name, B: Reference, C: JoinedDate, D: LastAttendance, E: Location,
   * F: RegularLocation, G: Number, H: WhatsappLink, I: LastAttendedBefore60Days,
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
        dto.reference = this.getCellValue(row.getCell(2));
        dto.joinedDate = this.getCellDateValue(row.getCell(3));
        dto.lastAttendance = this.getCellDateValue(row.getCell(4));
        dto.location = this.getCellValue(row.getCell(5));
        dto.regularLocation = this.getCellValue(row.getCell(6));
        dto.lastAttendedBefore60Days = this.getCellValue(row.getCell(7));
        dto.number = this.getCellValue(row.getCell(8))!;
        dto.whatsappLink = this.getCellValue(row.getCell(9));
        dto.status = this.getCellValue(row.getCell(10));
        dto.managementFeedbackrequiredtoremove = this.getCellValue(row.getCell(11));
        dto.outreachDate =  this.normalizeOutreachDate(this.getCellValue(row.getCell(12)));
        dto.whoReachedOut = this.getCellValue(row.getCell(13));
        dto.socials = this.getCellBooleanValue(row.getCell(14));
        dto.university = this.getCellBooleanValue(row.getCell(15));
        dto.outcome = this.getCellValue(row.getCell(16));
        dto.username = dto.number; 
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

  
  normalizeOutreachDate = (value: string | Date | number | null | undefined) : Date | null => {
  if (!value) return null;

  // Already a valid Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  // Excel serial number (very common!)
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + value * 86400000);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // dd.MM.yyyy
    const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (dotMatch) {
      const [, d, m, y] = dotMatch;
      return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    }

    // d/MM/yyyy
    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const [, d, m, y] = slashMatch;
      return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    }

    // fallback for ISO or others
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null; // invalid date
};


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
      dto.reference = this.normalizeField(row.reference || row.Reference);
      dto.joinedDate = this.parseDate(row.joineddate || row.joinedDate || row.JoinedDate);
      dto.lastAttendance = this.parseDate(row.lastattendance || row.lastAttendance || row.LastAttendance);
      dto.location = this.normalizeField(row.location || row.Location);
      dto.regularLocation = this.normalizeField(row.regularlocation || row.regularLocation || row.RegularLocation);
      dto.lastAttendedBefore60Days = this.normalizeField(row.lastattendedBefore60Days || row.LastAttendedBefore60Days);
      dto.number = this.normalizeField(row.number || row.Number)!;
      dto.whatsappLink = this.normalizeField(row.whatsapplink || row.whatsappLink || row.WhatsappLink);
      dto.status = this.normalizeField(row.status || row.Status);
      dto.managementFeedbackrequiredtoremove = this.normalizeField(row.managementFeedbackrequiredtoremove || row.ManagementFeedbackrequiredtoremove);
      dto.outreachDate = this.normalizeOutreachDate(row.outreachdate || row.outreachDate || row.OutreachDate);
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
