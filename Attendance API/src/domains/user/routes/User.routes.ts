import { Router } from "express";
import { UserService } from "../services/User.service.js";
import { RegisterUserDto } from "../dtos/registerUserDTO.js";
import { validateDto } from "../../../middleware/validateDto.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { authorize } from "../../../middleware/authorize.js";
import { asyncHandler } from "../../../middleware/asyncHandler.js";

const router = Router();
const userService = new UserService();

// CREATE
router.post(
  "/register",
  authenticate,
  authorize([]), // Only admins can create users
  validateDto(RegisterUserDto),
  asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  })
);

// READ ALL
router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "MANAGER"]),
  asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
  })
);

// READ ONE
router.get(
  "/:id",
  authenticate,
  authorize(["ADMIN", "MANAGER"]),
  asyncHandler(async (req, res) => {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  })
);

// // UPDATE
// router.put(
//   "/:id",
//   authenticate,
//   authorize(["ADMIN"]),
//   validateDto(RegisterUserDto, true), // allow partial updates
//   asyncHandler(async (req, res) => {
//     const updated = await userService.updateUser(Number(req.params.id), req.body);
//     if (!updated) return res.status(404).json({ message: "User not found" });
//     res.json(updated);
//   })
// );

// // DELETE
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(["ADMIN"]),
//   asyncHandler(async (req, res) => {
//     const success = await userService.deleteUser(Number(req.params.id));
//     if (!success) return res.status(404).json({ message: "User not found" });
//     res.status(204).send();
//   })
//);

export default router;
