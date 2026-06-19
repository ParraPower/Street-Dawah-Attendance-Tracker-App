import { Router } from "express";
import { authenticate } from "../../../modules/auth/authenticate";
import { authorize } from "../../../modules/auth/authorize";
import { asyncHandler } from "../../../middleware/asyncHandler";
import { ImportService } from "../../../features/import/domain/services/fixed-import-service";
import { ImportGroupService } from "../services/import-groups-service";
import { Scopes } from "../../../modules/auth/scopes";

const router = Router();

// Legacy import routes (attendance & groups from Excel files)
const importService = new ImportService();
const importGroupsService = new ImportGroupService();

// LEGACY: CREATE - Import attendance records from Excel
router.post(
  "/run",
  authenticate,
  authorize([Scopes.Khaleef]),
  asyncHandler(async (req, res) => {
    const user = await importService.run();
    res.status(201).json(user);
  })
);

// LEGACY: CREATE - Import groups from Excel
router.post(
  "/run/groups",
  authenticate,
  authorize([Scopes.Khaleef]),
  asyncHandler(async (req, res) => {
    const user = await importGroupsService.run();
    res.status(201).json(user);
  })
);

// LEGACY: FILE EXISTS - Check if import file exists
router.get(
  "/fileExists",
  authenticate,
  authorize([Scopes.Khaleef]),
  asyncHandler(async (req, res) => {
    const response = await importService.fileExists();
    res.status(201).json({
      response,
    });
  })
);

export default router;
