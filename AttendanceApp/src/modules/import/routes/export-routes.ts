import { Router } from "express";
//import { validateDto } from "../../../middleware/validateDto.js";
// import { authenticate } from "../../../middleware/authenticate.js";
// import { authorize } from "../../../middleware/authorize.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";
import { ImportService } from "../../../features/import/domain/services/fixed-import-service.js";
import { ExportService } from "../services/export-service.js";

const router = Router();
const importService = new ImportService();
const exportService = new ExportService();

// CREATE
router.post(
  "/run",
  //authenticate,
  //authorize([]), // Only admins can create users
  asyncHandler(async (req, res) => {
    const importResp = await importService.run();
    console.log(importResp.importData[0])
       console.log(importResp.importData[1])
    const user = await exportService.runExportUsersViaImport(importResp.importData, importResp.importUUID);
    res.status(201).json(user);
  })
);


export default router;
