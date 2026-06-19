import { Router } from "express";
import { BaseController, GlobalError, IJwtService } from "app-framework";
import { DawahRequestHandler } from "app-framework";
import { ScopeService, Scopes } from "app-framework";
import multer from "multer";
import { ImportUsersBulkResponseDto } from "../../application/dtos";
import { env } from "../../../../infrastructure/config/env";
import { UploadFileServiceFactory } from "@attendance/infrastructure/file/upload-file-service";
import { FileUploadError } from "@attendance/infrastructure/errors/import-errors";
import { ImportBulkUsersByFileUseCase } from "../../application/use-cases/import-bulk-users-by-file.usecase";
/**
 * Stub JWT Service for ImportController
 * AttendanceApp delegates JWT validation to Auth API middleware,
 * so we provide a minimal implementation that satisfies the interface
 */

export class ImportController extends BaseController {
  public readonly router = Router();
  private readonly upload: multer.Multer;
  private readonly uploadFileRunnerFn: (req: any, res: any, next: Function) => Promise<{ result: boolean; file: object; exception?: GlobalError }>;

  constructor(
    protected readonly scopeService: ScopeService,
    private readonly uploadFileService: UploadFileServiceFactory,
    protected readonly jwtService: IJwtService,
    private readonly importUsersUseCase: ImportBulkUsersByFileUseCase
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });

    // Configure multer for file uploads
    this.upload = this.uploadFileService.createMulter();

    // Create the upload file handler function with all the business logic
    this.uploadFileRunnerFn = this.uploadFileService.createUploadFileRunnerFn(this.upload);

    this.registerRoute("post", "/users", this.importUsers.bind(this), {
      authenticate: true,
      authorizeScopes: [Scopes.Khaleef],
    });
  }

  public importUsers: DawahRequestHandler<
    any,
    ImportUsersBulkResponseDto,
    any
  > = async (req, res) => {
    const result = await this.uploadFileRunnerFn(req, res, () => {});
    if (!result.result) {
      throw result.exception || new FileUploadError("File upload failed");
    }

    const importResult = await this.importUsersUseCase.execute(result.file as Express.Multer.File);

    res.status(200).json(importResult);
  }
}