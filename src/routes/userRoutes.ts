import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers";
import { idSchema, updateUserSchema } from "../schemas";
import { validateBody, validateParams } from "../middleware";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(updateUserSchema),
  updateUser
);
router.delete("/:id", validateParams(idSchema), deleteUser);

export default router;
