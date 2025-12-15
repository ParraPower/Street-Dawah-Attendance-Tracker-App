
import XLSX from "xlsx";
import Joi from "joi";
import fs from "fs";
import { resolve } from "path";
import { parse as dateFnParse } from "date-fns";
import ExcelJS from "exceljs";
import { ImportRow } from "../entities/import-row.js";

export class ImportService {

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

    private excelSerialToDate(serial: number | null | undefined): Date | null {
        if (!serial || serial === undefined)
            return null;

        // Excel incorrectly treats 1900 as a leap year, so we subtract 1 day
        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // 1899-12-30
        return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
    }


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

    /**
     * Convert a validated Joi row into an ImportRow instance.
     */
    private convertRowToImportRow(joiRow: any, importId: number): ImportRow {
        return new ImportRow({
            importId,
            Name: joiRow["Name"],
            Number: joiRow["Number"],
            WhatsappLink: joiRow.WhatsappLink,
            //JoinedDate: this.excelSerialToDate(joiRow["Joined Date"]),
            Reference: joiRow.Reference,
            //LastAttendance: this.excelSerialToDate(joiRow["Last attendance"]),
            LastAttendedBefore60Days: joiRow.LastAttendedBefore60Days,
            Location: joiRow.Location,
            RegularLocation: joiRow.RegularLocation,
            Status: joiRow.Status,
            OutreachDate: joiRow.OutreachDate,
            WhoReachedOut: joiRow.WhoReachedOut,
            Socials: ImportRow.parseBoolean(joiRow.Socials),
            University: ImportRow.parseBoolean(joiRow.University),
            Outcome: joiRow.Outcome,
            createdAt: new Date(),
            createdBy: 1
        }); 
        // return new ImportRow({
        //     importId,
        //     Name: joiRow["Name"],
        //     Number: joiRow["Number"],
        //     WhatsappLink: joiRow["Whatsapp Link"],
        //     JoinedDate: this.excelSerialToDate(joiRow["Joined Date"]),
        //     Reference: joiRow["Reference"],
        //     LastAttendance: this.excelSerialToDate(joiRow["Last attendance"]),
        //     LastAttendedBefore60Days: joiRow["Last attended before 60 days"],
        //     Location: joiRow["Location"],
        //     RegularLocation: joiRow["Regular location"],
        //     Status: joiRow["Status"],
        //     OutreachDate: joiRow["Outreach date"],
        //     WhoReachedOut: joiRow["Who reached out?"],
        //     Socials: ImportRow.parseBoolean(joiRow["Socials?"]),
        //     University: ImportRow.parseBoolean(joiRow["University"]),
        //     Outcome: joiRow["Outcome"],
        //     createdAt: new Date(),
        //     createdBy: 1
        // }); 
    }

    // private parseDate = (dateStr?: string): Date | null => {
    //     if (!dateStr) return null;
        
    //     try {
    //         return dateFnParse(dateStr, "d/MM/yyyy", new Date());
    //     } catch {
    //         return null;
    //     }

    // }

    public run = async () => {

        if (await this.fileExists()) {

            const path = "./New Brothers Attendance Record.xlsx"; // replace with your file path

            const CURRENT_MEMBERS_SHEET = "Current"

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(path);
            const sheet = workbook.getWorksheet(CURRENT_MEMBERS_SHEET);


            if (!sheet) {
                throw new Error("Failed to read file");
            }

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



            //Load workbook
            //const workbook = XLSX.readFile("New Brothers Attendance Record.xlsx", {  });

            console.log("Import.run() - end");

            // Access sheets
            //const currentSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Current"], { defval: null });
            //const formerSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Former"], { defval: null });
            
            const validSheet = this.validateSheet(results)

            //console.log("Current:", validSheet[1]);
            // //console.log("Former:", formerSheet);

            const firstRow = this.convertRowToImportRow(validSheet[1], 1);

            console.log(firstRow.JoinedDate?.toDateString(), firstRow.LastAttendance?.toDateString(), firstRow.Socials);
        }
        

        // return;


        // const validatedCurrent = this.validateSheet(currentSheet);
        // //const validatedFormer = this.validateSheet(formerSheet);

        // console.log("Validated Current:", validatedCurrent);
    } 
}