import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers";
import { createTaskSchema, updateTaskSchema, idSchema } from "../schemas";
import { validateBody, validateParams } from "../middleware";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.get("/", getAllTasks);
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
