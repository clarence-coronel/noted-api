import { Router } from "express";
import { getMe, login, register } from "../controllers";
import { createUserSchema, loginSchema } from "../schemas";
import { validateBody } from "../middleware";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", validateBody(createUserSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", auth, getMe);

export default router;
