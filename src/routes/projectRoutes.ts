import { Router } from "express";
import { createProject, deleteProject, getAllProjects } from "../controllers";
import { createProjectSchema, idSchema } from "../schemas";
import { validateBody, validateParams } from "../middleware";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.get("/", getAllProjects);
router.post("/", validateBody(createProjectSchema), createProject);
router.delete("/:id", validateParams(idSchema), deleteProject);

export default router;
