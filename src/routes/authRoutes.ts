import { Router } from "express";
import { login, register } from "../controllers";
import { createUserSchema, loginSchema } from "../schemas";
import { validateBody } from "../middleware";

const router = Router();

router.post("/register", validateBody(createUserSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
