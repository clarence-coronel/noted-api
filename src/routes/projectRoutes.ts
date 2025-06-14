import { Router } from "express";
import { createProject } from "../controllers";
import { createProjectSchema } from "../schemas";
import { validateBody } from "../middleware";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.post("/", validateBody(createProjectSchema), createProject);

export default router;
