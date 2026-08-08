import ExcelJS from "exceljs";
import { CreateSessionDto } from "../../features/sessions/application/dtos/create-session.dto";
import { ISessionFileParser } from "../../features/import/domain/services/session-file-parser.interface";

/** Parses session files containing Name, LocationId, DayOfWeek, StartTime, and EndTime columns. */
export class SessionFileParserService implements ISessionFileParser {
  async parseFile(file: Express.Multer.File): Promise<CreateSessionDto[]> {
    if (!file) throw new Error("No file provided");
    const fileName = file.originalname.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype === "application/vnd.ms-excel";
    const isCsv = fileName.endsWith(".csv") || file.mimetype === "text/csv" || file.mimetype === "application/csv";
    if (isExcel) return this.parseExcel(file.buffer);
    if (isCsv) return this.parseCsv(file.buffer);
    throw new Error(`Unsupported file format. Please provide .xlsx, .xls, or .csv file. Received: ${file.mimetype || fileName}`);
  }

  private async parseExcel(buffer: Buffer): Promise<CreateSessionDto[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error("No sheets found in the Excel file");
      const headers = [1, 2, 3, 4, 5].map((column) => this.value(worksheet.getCell(1, column).value)?.toLowerCase());
      if (headers.join("|") !== "name|locationid|dayofweek|starttime|endtime") {
        throw new Error("Session file must have Name, LocationId, DayOfWeek, StartTime, and EndTime columns in that order");
      }
      const sessions: CreateSessionDto[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const values = [1, 2, 3, 4, 5].map((column) => this.value(row.getCell(column).value));
        if (values.some(Boolean)) sessions.push({ name: values[0] || "", locationId: Number(values[1]), dayOfWeek: Number(values[2]), startTime: values[3] || "", endTime: values[4] || "" });
      });
      if (sessions.length === 0) throw new Error("No data rows found in the session file");
      return sessions;
    } catch (error: any) {
      throw new Error(`Failed to parse sessions Excel file: ${error.message}`);
    }
  }

  private parseCsv(buffer: Buffer): CreateSessionDto[] {
    try {
      const lines = buffer.toString("utf-8").trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error("Session CSV must have a header row and at least one data row");
      const headers = this.parseCsvLine(lines[0]).map((header) => header.replace(/^\uFEFF/, "").trim().toLowerCase());
      const required = ["name", "locationid", "dayofweek", "starttime", "endtime"];
      const indexes = required.map((header) => headers.indexOf(header));
      if (indexes.some((index) => index === -1)) throw new Error("Session CSV must contain Name, LocationId, DayOfWeek, StartTime, and EndTime columns");
      const sessions = lines.slice(1).filter((line) => line.trim()).map((line) => {
        const values = this.parseCsvLine(line);
        return { name: this.value(values[indexes[0]]) || "", locationId: Number(values[indexes[1]]), dayOfWeek: Number(values[indexes[2]]), startTime: this.value(values[indexes[3]]) || "", endTime: this.value(values[indexes[4]]) || "" };
      });
      if (sessions.length === 0) throw new Error("No data rows found in the session file");
      return sessions;
    } catch (error: any) {
      throw new Error(`Failed to parse sessions CSV file: ${error.message}`);
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
        if (insideQuotes && nextCharacter === '"') { current += '"'; i++; } else insideQuotes = !insideQuotes;
      } else if (character === "," && !insideQuotes) { result.push(current); current = ""; } else current += character;
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
