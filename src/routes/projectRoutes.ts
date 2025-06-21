import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers";
import { createProjectSchema, idSchema } from "../schemas";
import { validateBody, validateParams } from "../middleware";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.get("/", getAllProjects);
router.get("/:id", validateParams(idSchema), getProjectById);
router.post("/", validateBody(createProjectSchema), createProject);
router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(createProjectSchema),
  updateProject
);
router.delete("/:id", validateParams(idSchema), deleteProject);

export default router;
