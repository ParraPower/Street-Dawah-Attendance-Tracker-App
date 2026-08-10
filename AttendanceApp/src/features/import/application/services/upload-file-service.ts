import { Multer } from "multer";

export interface UploadFileServiceFactory {
  createMulter(): Multer;
  createUploadFileRunnerFn(
    upload: Multer
  ): (req: any, res: any, next: Function) => Promise<false | object>;
}