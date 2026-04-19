
import XLSX from "xlsx";
import Joi, { number } from "joi";
import fs from "fs";
// import { resolve } from "path";
// import { parse as dateFnParse } from "date-fns";
import ExcelJS from "exceljs";
import { ImportRow } from "../../../domains/import/entities/import-row.js";
import { UUID, randomUUID } from "crypto";

export class ImportService {

    public readonly CURRENT_MEMBERS_SHEET = "Current"
    public readonly FORMER_MEMBERS_SHEET = "Former"


    public fileExists = async (): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            const path = "./New Brothers Attendance Record.xlsx"; // replace with your file path

            console.log("Import.fileExists() - start");

            fs.access(path, fs.constants.F_OK, (err) => {
                console.log("Import.fileExists() - end");
            if (err) {
                console.log(`❌ File does not exist: ${path}`);
                resolve(false);
            } else {
                console.log(`✅ File exists: ${path}`);
                resolve(true);
            }
            });

            
        });

    }

    public run = async () => {
        const path = "./New Brothers Attendance Record.xlsx"; // replace with your file path
        const importUUID = randomUUID();

        if (!await this.fileExists()) {
            return {
                importUUID, importData: []
            }
        }

        const importData = await this.runViaExcelJs(path, importUUID)

        return {
            importData, importUUID
        }
    } 

    /*
     *
     */
    private convertExcelJsSheetInImportRowArray(sheet: ExcelJS.Worksheet): ImportRow[] {
        const results: any[] = [];

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header row
            
            const rowData: any = {
                Name: row.getCell(1).value,
                Number: row.getCell(2).value,
                WhatsappLink: (row.getCell(3).value as { result: string }).result,
                JoinedDate: row.getCell(4).value,
                Reference: row.getCell(5).value,
                LastAttendance: row.getCell(6).value,
                LastAttendedBefore60Days: (row.getCell(7).value as { result: string }).result,
                Location: row.getCell(8).value,
                RegularLocation: row.getCell(9).value,
                Status: row.getCell(10).value,
                OutreachDate: row.getCell(11).value,
                WhoReachedOut: row.getCell(12).value,
                Socials: row.getCell(13).value,
                University: row.getCell(14).value,
                Outcome: row.getCell(15).value,
            };
            results.push(rowData);
        })

        return results;
    }

    private runViaJoi = async (path: string) => {
        //Load workbook
        const workbook = XLSX.readFile(path, {  });

        // Access sheets
        const currentSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Current"], { defval: null });
        const formerSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Former"], { defval: null });

        console.log("Current:", currentSheet);
        console.log("Former:", formerSheet);

        const validSheet = this.validateSheet(currentSheet)

        console.log("Validated Current:", validSheet);

        const firstRow = validSheet[0]

        console.log(firstRow)
        console.log(firstRow.JoinedDate?.toDateString(), firstRow.LastAttendance?.toDateString(), firstRow.Socials);
    }

    private runViaExcelJs = async (path: string, importGuid: UUID) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path);
        const sheet = workbook.getWorksheet(this.CURRENT_MEMBERS_SHEET);
        //const formerSheet = workbook.getWorksheet(this.FORMER_MEMBERS_SHEET)

        if (!sheet) {
            throw new Error("Failed to read file");
        }

        const results = this.convertExcelJsSheetInImportRowArray(sheet)

        const validSheet = this.validateSheet(results)
        //const validatedFormer = this.validateSheet(formerSheet);

        console.log("Validated Current:", validSheet);

        const firstRow = validSheet[0]

        console.log(firstRow)
        console.log(firstRow.JoinedDate?.toDateString(), firstRow.LastAttendance?.toDateString(), firstRow.Socials);

        return results
    }

    /*
     * Validate an excel sheet data using the specified column rules
     */
    private validateSheet = (sheetData: unknown[]) => {

        const schema = Joi.object({
        Name: Joi.string().required(),
        Number: Joi.any().required(),
        WhatsappLink: Joi.string().required(),
        JoinedDate: Joi.any()
            .allow(null),
        Reference: Joi.string().allow(null),
        LastAttendance: Joi.any()
           .allow(null),
        LastAttendedBefore60Days: Joi.any().allow(null),
        Location: Joi.string().allow(null),
        RegularLocation: Joi.string().allow(null),
        Status: Joi.string().allow(null),
        OutreachDate: Joi.any().allow(null),
        WhoReachedOut: Joi.string().allow(null),
        Socials: Joi.string().allow(null),
        University: Joi.string().allow(null),
        Outcome: Joi.string().allow(null)
        });

        return sheetData.map((row: any, index: number) => {
            const { error, value } = schema.validate(row, { convert: false });
            if (error) {
                console.error(`Row ${index + 2} failed validation - ${row['Number']?.toString() ?? 'fake'}: value: ${value}`, error.details);
                console.log(JSON.stringify(row))
                console.log(JSON.stringify(value))
            }
            return row;
        });
    }

    // /*
    //  * 
    //  */
    // private excelDateToDate(date: Date | null): Date | null {
    //     if (!date || date === undefined)
    //         return null;

    //     return date

    //     // if (typeof dateStr !== 'string') {
    //     //     console.log(dateStr, typeof dateStr)
    //     //     throw new Error("Not a string date")
    //     //     console.log(dateStr)
    //     // }
    //     // const outputDate: any = null;

    //     // const formattedDate = dateFnParse(dateStr, "d/M/yyyy", outputDate, {})
    //     // console.log("dfn", formattedDate, outputDate, dateStr)
    //     //return formattedDate;
    // }

    /*
     * 
     */
    private excelSerialToDate(serial: number | null | undefined): Date | null {
        if (!serial || serial === undefined)
            return null;

        // Excel incorrectly treats 1900 as a leap year, so we subtract 1 day
        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // 1899-12-30
        return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
    }

    // /*
    //  * Convert a validated ExcelJs row into an ImportRow instance.
    //  */
    // private convertExcelJsRowToImportRow(joiRow: any, importId: number): ImportRow {
    //     return new ImportRow({
    //         importId,
    //         Name: joiRow["Name"],
    //         Number: joiRow["Number"],
    //         WhatsappLink: joiRow.WhatsappLink,
    //         JoinedDate: this.excelDateToDate(joiRow["JoinedDate"]),
    //         //JoinedDate: this.excelSerialToDate(joiRow["Joined Date"]),
    //         Reference: joiRow.Reference,
    //         LastAttendance: this.excelDateToDate(joiRow["LastAttendance"]),
    //         LastAttendedBefore60Days: joiRow.LastAttendedBefore60Days,
    //         Location: joiRow.Location,
    //         RegularLocation: joiRow.RegularLocation,
    //         Status: joiRow.Status,
    //         OutreachDate: joiRow.OutreachDate,
    //         WhoReachedOut: joiRow.WhoReachedOut,
    //         Socials: ImportRow.parseBoolean(joiRow.Socials),
    //         University: ImportRow.parseBoolean(joiRow.University),
    //         Outcome: joiRow.Outcome,
    //         createdAt: new Date(),
    //         createdBy: 1
    //     }); 
    // }

    /*
     * Convert a validate Joi row into an ImportRow instance.
     */
    private convertJoiRowToImportRow(joiRow: any, importId: number): ImportRow {
        return new ImportRow({
            importId,
            Name: joiRow["Name"],
            Number: joiRow["Number"],
            WhatsappLink: joiRow["Whatsapp Link"],
            JoinedDate: this.excelSerialToDate(joiRow["Joined Date"]),
            Reference: joiRow["Reference"],
            LastAttendance: this.excelSerialToDate(joiRow["Last attendance"]),
            LastAttendedBefore60Days: joiRow["Last attended before 60 days"],
            Location: joiRow["Location"],
            RegularLocation: joiRow["Regular location"],
            Status: joiRow["Status"],
            OutreachDate: joiRow["Outreach date"],
            WhoReachedOut: joiRow["Who reached out?"],
            Socials: ImportRow.parseBoolean(joiRow["Socials?"]),
            University: ImportRow.parseBoolean(joiRow["University"]),
            Outcome: joiRow["Outcome"],
            createdAt: new Date(),
            createdBy: 1
        }); 
    }

    // /*
    //  * Parse an excel date string into a Date object
    //  */
    // private parseDate = (dateStr?: string): Date | null => {
    //     if (!dateStr) return null;
        
    //     try {
    //         return dateFnParse(dateStr, "d/MM/yyyy", new Date());
    //     } catch {
    //         return null;
    //     }

    // }

}