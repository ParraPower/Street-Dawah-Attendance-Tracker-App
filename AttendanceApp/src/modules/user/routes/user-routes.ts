import { Router } from "express";
import { UserService } from "../services/user-service";
import { RegisterUserDto } from "../dtos/register-user-dto";
import { validateDto } from "../../../middleware/validateDto";
import { authenticate } from "../../auth/authenticate";
import { authorize } from "../../auth/authorize";
import { asyncHandler } from "../../../middleware/asyncHandler";
import { Scopes } from "../../../modules/auth/scopes";
import { userRateLimiter } from "../../../middleware/userRateLimiter";

const router = Router();
const userService = new UserService();

router.post(
  "/register",
  authenticate,
  validateDto(RegisterUserDto),
  asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  })
);

router.get(
  "/",
  userRateLimiter,
  authenticate,
  authorize([ Scopes.Khaleef ]),
  asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
  })
);

router.get(
  "/:id",
  userRateLimiter,
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  })
);

router.post(
  "/admin-create",
  userRateLimiter,
  authenticate,
  authorize([ Scopes.Khaleef ]), // Only admins can create users
  asyncHandler(async (req, res) => {
    const user = await userService.createAdminUser();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  })
);

export default router;
