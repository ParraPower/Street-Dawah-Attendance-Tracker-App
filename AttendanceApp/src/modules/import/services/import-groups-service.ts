import { randomUUID, UUID } from "crypto";
import ExcelJS from 'exceljs'
import fs from "fs";
import Joi from "joi";
import { ImportGroupRow } from "../../../domains/import/entities/import-group-row.js";

export class ImportGroupService {
    
    public fileExists = async (): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            const path = "./Groups.xlsx"; // replace with your file path

            console.log("Import-Group.fileExists() - start");

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
        const path = "./Groups.xlsx"; // replace with your file path
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

    private runViaExcelJs = async (path: string, importGuid: UUID) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path);
        const sheet = workbook.getWorksheet('Form1');
        //const formerSheet = workbook.getWorksheet(this.FORMER_MEMBERS_SHEET)

        if (!sheet) {
            throw new Error("Failed to read file");
        }

        const results = this.convertExcelJsSheetInImportGroupRowArray(sheet)

        const validSheet = this.validateSheet(results)
        //const validatedFormer = this.validateSheet(formerSheet);

        console.log("Validated Form1:", validSheet);

        const firstRow = validSheet[0]

        console.log(firstRow)
        console.log(firstRow.Name, firstRow.TypeOfMembers, firstRow.Socials);

        return results
    }

    /*
        * Validate an excel sheet data using the specified column rules
        */
    private validateSheet = (sheetData: unknown[]) => {

        const schema = Joi.object({
        Id: Joi.string().required(),
        StartTime: Joi.any().required(),
        CompletionTime: Joi.any().required(),
        Email: Joi.any()
            .required(),
        Name: Joi.string().allow(null),
        NameOfGroup: Joi.string()
            .required(),
        TypeOfMembers: Joi.string()
            .required(),
        });

        return sheetData.map((row: any, index: number) => {
            const { error, value } = schema.validate(row, { convert: false });
            if (error) {
                console.error(`Row ${index + 2} failed validation - ${row['Name']?.toString() ?? 'fake'}: value: ${value}`, error.details);
                console.log(JSON.stringify(row))
                console.log(JSON.stringify(value))
            }
            return row;
        });
    }

        /*
         *
         */
        private convertExcelJsSheetInImportGroupRowArray(sheet: ExcelJS.Worksheet): ImportGroupRow[] {
            const results: ImportGroupRow[] = [];
                console.log(sheet.rowCount)    
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // skip header row

                const rowData: ImportGroupRow = {
                    code: row.getCell(8).value as string,
                    importId: 1,
                    id: 1,
                    Name: row.getCell(6).value as string,
                    Type: row.getCell(7).value as string,
                    createdAt: new Date(),
                    createdBy: 1,
                };
                results.push(rowData);
            })
    
            return results;
        }
}