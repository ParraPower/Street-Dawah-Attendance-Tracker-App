import ExcelJS from "exceljs";
import { CreateUserMembershipDto } from "../../features/user-memberships/application/dtos/create-user-membership.dto";
import { IUserMembershipFileParser } from "../../features/import/domain/services/user-membership-file-parser.interface";

/** Parses user-membership files containing UserId, MembershipId, and Active columns. */
export class UserMembershipFileParserService implements IUserMembershipFileParser {
  async parseFile(file: Express.Multer.File): Promise<CreateUserMembershipDto[]> {
    if (!file) throw new Error("No file provided");
    const fileName = file.originalname.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype === "application/vnd.ms-excel";
    const isCsv = fileName.endsWith(".csv") || file.mimetype === "text/csv" || file.mimetype === "application/csv";
    if (isExcel) return this.parseExcel(file.buffer);
    if (isCsv) return this.parseCsv(file.buffer);
    throw new Error(`Unsupported file format. Please provide .xlsx, .xls, or .csv file. Received: ${file.mimetype || fileName}`);
  }

  private async parseExcel(buffer: Buffer): Promise<CreateUserMembershipDto[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error("No sheets found in the Excel file");
      const headers = [1, 2, 3].map((column) => this.value(worksheet.getCell(1, column).value)?.toLowerCase());
      if (headers.join("|") !== "userid|membershipid|active") throw new Error("User-membership file must have UserId, MembershipId, and Active columns in that order");

      const records: CreateUserMembershipDto[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const userId = this.parseId(this.value(row.getCell(1).value), "UserId");
        const membershipId = this.parseId(this.value(row.getCell(2).value), "MembershipId");
        const activeValue = this.value(row.getCell(3).value);
        if (userId !== undefined || membershipId !== undefined || activeValue !== undefined) {
          if (userId === undefined) throw new Error(`UserId is required on row ${rowNumber}`);
          if (membershipId === undefined) throw new Error(`MembershipId is required on row ${rowNumber}`);
          records.push({ userId, membershipId, active: this.parseBoolean(activeValue, "Active", rowNumber) });
        }
      });
      if (records.length === 0) throw new Error("No data rows found in the user-membership file");
      return records;
    } catch (error: any) {
      throw new Error(`Failed to parse user-memberships Excel file: ${error.message}`);
    }
  }

  private parseCsv(buffer: Buffer): CreateUserMembershipDto[] {
    try {
      const content = buffer.toString("utf-8").trim();
      const lines = content ? content.split(/\r?\n/) : [];
      if (lines.length < 2) throw new Error("User-membership CSV must have a header row and at least one data row");
      const headers = this.parseCsvLine(lines[0]).map((header) => header.replace(/^\uFEFF/, "").trim().toLowerCase());
      const userIdIndex = headers.indexOf("userid");
      const membershipIdIndex = headers.indexOf("membershipid");
      const activeIndex = headers.indexOf("active");
      if (userIdIndex === -1 || membershipIdIndex === -1 || activeIndex === -1) throw new Error("User-membership CSV must contain UserId, MembershipId, and Active columns");

      const records = lines.slice(1).filter((line) => line.trim()).map((line, index) => {
        const rowNumber = index + 2;
        const values = this.parseCsvLine(line);
        const userId = this.parseId(this.value(values[userIdIndex]), "UserId");
        const membershipId = this.parseId(this.value(values[membershipIdIndex]), "MembershipId");
        if (userId === undefined) throw new Error(`UserId is required on row ${rowNumber}`);
        if (membershipId === undefined) throw new Error(`MembershipId is required on row ${rowNumber}`);
        return { userId, membershipId, active: this.parseBoolean(this.value(values[activeIndex]), "Active", rowNumber) };
      });
      if (records.length === 0) throw new Error("No data rows found in the user-membership file");
      return records;
    } catch (error: any) {
      throw new Error(`Failed to parse user-memberships CSV file: ${error.message}`);
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

  private parseId(value: string | undefined, fieldName: string): number | undefined {
    if (value === undefined) return undefined;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${fieldName} must be a positive integer`);
    return parsed;
  }

  private parseBoolean(value: string | undefined, fieldName: string, rowNumber: number): boolean {
    if (value === undefined) throw new Error(`${fieldName} is required on row ${rowNumber}`);
    const normalized = value.toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
    throw new Error(`${fieldName} must be true or false on row ${rowNumber}`);
  }

  private value(value: unknown): string | undefined {
    if (value === null || value === undefined) return undefined;
    const normalized = String(value).trim();
    return normalized || undefined;
  }
}
