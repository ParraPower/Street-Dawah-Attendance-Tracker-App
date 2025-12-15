import { Router } from "express";
//import { validateDto } from "../../../middleware/validateDto.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { authorize } from "../../../middleware/authorize.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";
import { ImportService } from "../services/import-service.js";

const router = Router();
const importService = new ImportService();

// CREATE
router.post(
  "/run",
  //authenticate,
  //authorize([]), // Only admins can create users
  asyncHandler(async (req, res) => {
    const user = await importService.run();
    res.status(201).json(user);
  })
);

// FILE EXISTS
router.get(
  "/fileExists",
  //authenticate,
  //authorize([]), // Only admins can create users
  asyncHandler(async (req, res) => {
    const response = await importService.fileExists();
    res.status(201).json({
      response
    });
  })
);


export default router;
