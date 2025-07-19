import { Router } from "express";
import {
  changePassword,
  getMe,
  getNewAccessToken,
  login,
  register,
} from "../controllers";
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
} from "../schemas";
import { validateBody } from "../middleware";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/me", auth, getMe);
router.post("/register", validateBody(createUserSchema), register);
router.get("/access-token", getNewAccessToken);
router.post("/login", validateBody(loginSchema), login);
router.put("/access-token", getNewAccessToken);
router.put(
  "/change-password",
  auth,
  validateBody(changePasswordSchema),
  changePassword
);

export default router;
