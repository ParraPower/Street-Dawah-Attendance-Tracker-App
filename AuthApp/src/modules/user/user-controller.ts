import { Router } from "express";
import { authenticate, authorize } from "@/modules/auth/auth-middleware";
import { Scopes } from "@/modules/auth/scopes";
import { UserService } from "./user-service";
import { CreateUserDto } from "@/dtos/user/create-user.dto";
//import { createUserHandler, getUserHandler } from "./user.controller";

const userService = new UserService();

const router = Router();

router.get("/:id", authenticate, authorize([Scopes.Mudeer, Scopes.Khaleef, Scopes.Emir]), (req, res) => {

});

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

export default router;
