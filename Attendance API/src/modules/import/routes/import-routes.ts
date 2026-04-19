import { Router } from "express";
//import { validateDto } from "../../../middleware/validateDto";
import { authenticate } from "@/modules/auth/authenticate";
import { authorize } from "@/modules/auth/authorize";
import { asyncHandler } from "@/middleware/asyncHandler";
import { ImportService } from "@/modules/import/services/import-service";
import { ImportGroupService } from "../services/import-groups-service";
import { Scopes } from "@/modules/auth/scopes";

const router = Router();
const importService = new ImportService();
const importGroupsService = new ImportGroupService()

// CREATE
router.post(
  "/run",
  authenticate,
  authorize([ Scopes.Khaleef ]), // Only admins can create users
  asyncHandler(async (req, res) => {
    const user = await importService.run();
    res.status(201).json(user);
  })
);

// CREATE
router.post(
  "/run/groups",
  authenticate,
  authorize([ Scopes.Khaleef ]), // Only admins can create users
  asyncHandler(async (req, res) => {
    const user = await importGroupsService.run();
    res.status(201).json(user);
  })
);

// FILE EXISTS
router.get(
  "/fileExists",
  authenticate,
  authorize([ Scopes.Khaleef ]), // Only admins can create users
  asyncHandler(async (req, res) => {
    const response = await importService.fileExists();
    res.status(201).json({
      response
    });
  })
);


export default router;
