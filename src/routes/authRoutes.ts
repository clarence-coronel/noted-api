import { Router } from "express";
import { register } from "../controllers";
import { validateBody } from "../middleware/validateBody";
import { createUserSchema, loginSchema } from "../schemas";

const router = Router();

router.post("/auth/register", validateBody(createUserSchema), register);
router.post("/auth/login", validateBody(loginSchema), register);

export default router;
