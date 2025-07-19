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

// Authenticated routes
router.get("/me", auth, getMe);
router.put(
  "/change-password",
  auth,
  validateBody(changePasswordSchema),
  changePassword
);

// Public routes
router.post("/register", validateBody(createUserSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.route("/access-token").get(getNewAccessToken).put(getNewAccessToken);

export default router;
