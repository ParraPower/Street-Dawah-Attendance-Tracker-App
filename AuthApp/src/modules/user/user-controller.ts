import { Router } from "express";
import { authenticate, authorize } from "@/modules/auth/auth-middleware";
import { Scopes } from "@/modules/auth/scopes";
import { UserService } from "./user-service";
import { CreateUserDto } from "@/dtos/user/create-user.dto";
import asyncHandler from "@/middleware/asyncHandler";
//import { createUserHandler, getUserHandler } from "./user.controller";

const userService = new UserService();

const router = Router();


router.post(
  "/",
  authorize([Scopes.Mudeer, Scopes.Khaleef, Scopes.Emir]),
  async (req, res) => {
    const requestBody = req.body as CreateUserDto;
    const user = await userService.createUser(requestBody);
    res.json(user);
  }
);

router.post(
  "/reset-password/:temporaryPasswordGuid",
  async (req, res) => {
    const { temporaryPasswordGuid } = req.params;
    const { newPassword } = req.body;
    const result = await userService.resetPassword(temporaryPasswordGuid, newPassword);
    res.json(result);
  }
)

router.get("/:id", authenticate, authorize([Scopes.Emir]), async (req, res) => {
  const user = await userService.getUserById(parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// TODO: Add route for bulk user creation, which will be used by the admin to create users en masse.
router.post(
  "/bulk",
  authorize([Scopes.Mudeer, Scopes.Khaleef, Scopes.Emir]),
  asyncHandler(async (req, res) => {
    const users = req.body as CreateUserDto[];
    const result = await userService.createUsers(users);
    res.json(result);
  })
);
export { router as UserController };
