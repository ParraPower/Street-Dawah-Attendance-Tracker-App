import ExcelJS from "exceljs";
import { CreateLocationDto } from "../../features/locations/application/dtos/create-location.dto";
import { ILocationFileParser } from "../../features/import/domain/services/location-file-parser.interface";

/** Parses location files containing Name and Postcode columns. */
export class LocationFileParserService implements ILocationFileParser {
  async parseFile(file: Express.Multer.File): Promise<CreateLocationDto[]> {
    if (!file) throw new Error("No file provided");

    const fileName = file.originalname.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel";
    const isCsv = fileName.endsWith(".csv") || file.mimetype === "text/csv" || file.mimetype === "application/csv";

    if (isExcel) return this.parseExcel(file.buffer);
    if (isCsv) return this.parseCsv(file.buffer);
    throw new Error(`Unsupported file format. Please provide .xlsx, .xls, or .csv file. Received: ${file.mimetype || fileName}`);
  }

  private async parseExcel(buffer: Buffer): Promise<CreateLocationDto[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error("No sheets found in the Excel file");

      const headers = [1, 2].map((column) => this.value(worksheet.getCell(1, column).value)?.toLowerCase());
      if (headers[0] !== "name" || headers[1] !== "postcode") {
        throw new Error("Location file must have Name and Postcode columns in that order");
      }

      const locations: CreateLocationDto[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const name = this.value(row.getCell(1).value);
        const postcode = this.value(row.getCell(2).value);
        if (name || postcode) locations.push({ name: name || "", postcode: postcode || "" });
      });

      if (locations.length === 0) throw new Error("No data rows found in the location file");
      return locations;
    } catch (error: any) {
      throw new Error(`Failed to parse locations Excel file: ${error.message}`);
    }
  }

  private parseCsv(buffer: Buffer): CreateLocationDto[] {
    try {
      const lines = buffer.toString("utf-8").trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error("Location CSV must have a header row and at least one data row");

      const headers = this.parseCsvLine(lines[0]).map((header) => header.replace(/^\uFEFF/, "").trim().toLowerCase());
      const nameIndex = headers.indexOf("name");
      const postcodeIndex = headers.indexOf("postcode");
      if (nameIndex === -1 || postcodeIndex === -1) {
        throw new Error("Location CSV must contain Name and Postcode columns");
      }

      const locations = lines.slice(1)
        .filter((line) => line.trim())
        .map((line) => {
          const values = this.parseCsvLine(line);
          return {
            name: this.value(values[nameIndex]) || "",
            postcode: this.value(values[postcodeIndex]) || "",
          };
        });

      if (locations.length === 0) throw new Error("No data rows found in the location file");
      return locations;
    } catch (error: any) {
      throw new Error(`Failed to parse locations CSV file: ${error.message}`);
    }
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const character = line[i];
      const nextCharacter = line[i + 1];
      if (character === '"') {
        if (insideQuotes && nextCharacter === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (character === "," && !insideQuotes) {
        result.push(current);
        current = "";
      } else {
        current += character;
      }
    }
    result.push(current);
    return result;
  }

  private value(value: unknown): string | undefined {
    if (value === null || value === undefined) return undefined;
    const normalized = String(value).trim();
    return normalized || undefined;
  }
}