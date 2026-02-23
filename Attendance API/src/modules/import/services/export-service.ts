import ExcelJS from 'exceljs'
import { ImportRow } from "../../../domains/import/entities/import-row.js";
import { UUID } from 'crypto';

export class ExportService {
    public async runExportUsersViaImport(importArray: ImportRow[], importUUID: UUID) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Current");

          // Add header row
        sheet.addRow(["Name", "Number", "Whatsapp Link", "Joined Date", "Reference"]);

        // Add data rows
        for (var i = 0; i < 2; ++i) {
            const currRow = importArray[i]
            const whatsAppLinkFnStr = this.getWhatsAppLinkExcelFunctionString(i + 1)
            sheet.addRow([currRow.Name, currRow.Number, whatsAppLinkFnStr, currRow.JoinedDate, currRow.Reference]);
        }

        // Style header row
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF0000FF" } // blue background
        };

        // Save to file
        await workbook.xlsx.writeFile("output.xlsx");
        console.log("✅ Excel file written successfully!");
    }

    private getWhatsAppLinkExcelFunctionString = (rowNumber: number) => `=HYPERLINK("https://wa.me/" & TRIM(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(B${rowNumber},"'",""),"+","")," ",""),"(",""),")","")),"Message on WhatsApp")`
}