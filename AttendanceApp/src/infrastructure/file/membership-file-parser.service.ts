import ExcelJS from "exceljs";
import { CreateMembershipDto } from "../../features/memberships/application/dtos/create-membership.dto";
import { IMembershipFileParser } from "../../features/import/domain/services/membership-file-parser.interface";

/** Parses membership files containing Name and MembershipTypesFlag columns. */
export class MembershipFileParserService implements IMembershipFileParser {
  async parseFile(file: Express.Multer.File): Promise<CreateMembershipDto[]> {
    if (!file) throw new Error("No file provided");
    const fileName = file.originalname.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype === "application/vnd.ms-excel";
    const isCsv = fileName.endsWith(".csv") || file.mimetype === "text/csv" || file.mimetype === "application/csv";
    if (isExcel) return this.parseExcel(file.buffer);
    if (isCsv) return this.parseCsv(file.buffer);
    throw new Error(`Unsupported file format. Please provide .xlsx, .xls, or .csv file. Received: ${file.mimetype || fileName}`);
  }

  private async parseExcel(buffer: Buffer): Promise<CreateMembershipDto[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error("No sheets found in the Excel file");
      const headers = [1, 2].map((column) => this.value(worksheet.getCell(1, column).value)?.toLowerCase());
      if (headers.join("|") !== "name|membershiptypesflag") throw new Error("Membership file must have Name and MembershipTypesFlag columns in that order");
      const memberships: CreateMembershipDto[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const name = this.value(row.getCell(1).value);
        const flag = this.value(row.getCell(2).value);
        if (name || flag) memberships.push({ name: name || "", membershipTypesFlag: Number(flag) });
      });
      if (memberships.length === 0) throw new Error("No data rows found in the membership file");
      return memberships;
    } catch (error: any) {
      throw new Error(`Failed to parse memberships Excel file: ${error.message}`);
    }
  }

  private parseCsv(buffer: Buffer): CreateMembershipDto[] {
    try {
      const lines = buffer.toString("utf-8").trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error("Membership CSV must have a header row and at least one data row");
      const headers = this.parseCsvLine(lines[0]).map((header) => header.replace(/^\uFEFF/, "").trim().toLowerCase());
      const nameIndex = headers.indexOf("name");
      const flagIndex = headers.indexOf("membershiptypesflag");
      if (nameIndex === -1 || flagIndex === -1) throw new Error("Membership CSV must contain Name and MembershipTypesFlag columns");
      const memberships = lines.slice(1).filter((line) => line.trim()).map((line) => {
        const values = this.parseCsvLine(line);
        return { name: this.value(values[nameIndex]) || "", membershipTypesFlag: Number(values[flagIndex]) };
      });
      if (memberships.length === 0) throw new Error("No data rows found in the membership file");
      return memberships;
    } catch (error: any) {
      throw new Error(`Failed to parse memberships CSV file: ${error.message}`);
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
