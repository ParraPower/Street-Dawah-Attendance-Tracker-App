import { UploadFileServiceFactory as IUploadFileServiceFactory } from "@attendance/features/import/application/services/upload-file-service";
import multer, { Multer } from "multer";
import { NoFileProvidedError, UploadFileError } from "../errors/import-errors";
import { GlobalError } from "@shared/errors/types";

export class UploadFileServiceFactory implements IUploadFileServiceFactory {
  constructor(
  ) {}

  createMulter(): Multer {
    return multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
      fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
          "application/csv",
        ];
        const allowedExtensions = [".xlsx", ".xls", ".csv"];
        const fileName = file.originalname.toLowerCase();

        if (
          allowedMimes.includes(file.mimetype) ||
          allowedExtensions.some((ext) => fileName.endsWith(ext))
        ) {
          cb(null, true);
        } else {
          cb(new Error(`Invalid file format. Accepted formats: .xlsx, .xls, .csv`));
        }
      },
    });
  }

  createUploadFileRunnerFn(upload: Multer): (req: any, res: any, next: Function) => Promise<{ result: boolean; file: object; exception?: GlobalError }> {
    return async (req: any, res: any, next: Function) => {
      return new Promise<{ result: boolean; file: object; exception?: GlobalError }>((resolve) => {
        upload.single("file")(req, res, async (err: any) => {
          if (err) {
            console.error("❌ File upload error:", err.message);
            return resolve({ result: false, file: {}, exception: new UploadFileError(err.message || "File upload failed") });
            //throw new UploadFileError(err.message || "File upload failed");
          }

          console.log("📁 File uploaded successfully, processing file...", req.file);
          const file = req.file;
          if (!file) 
           return resolve({ result: false, file: {}, exception: new NoFileProvidedError("No file provided in the request -  Please upload an Excel (.xlsx, .xls) or CSV (.csv) file") });
           //throw new NoFileProvidedError("No file provided in the request -  Please upload an Excel (.xlsx, .xls) or CSV (.csv) file");

          return resolve({ result: true, file });
        });
      });
    };
  }
}

