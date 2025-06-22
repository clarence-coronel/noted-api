import { Router } from "express";
import { createTaskSchema, idSchema, updateTaskSchema } from "../schemas";
import { validateBody, validateParams } from "../middleware";
import { auth } from "../middleware/auth";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
} from "../controllers";

const router = Router();

router.use(auth);

// router.get("/", getAllProjects);
router.get("/:id", validateParams(idSchema), getTaskById);
router.post("/", validateBody(createTaskSchema), createTask);
router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(updateTaskSchema),
  updateTask
);
router.delete("/:id", validateParams(idSchema), deleteTask);

export default router;
