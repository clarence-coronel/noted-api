import { Router } from "express";
import { register } from "../controllers";
import { createUserSchema, loginSchema } from "../schemas";
import { validateBody } from "../middleware";

const router = Router();

router.post("/auth/register", validateBody(createUserSchema), register);
router.post("/auth/login", validateBody(loginSchema), register);

export default router;
