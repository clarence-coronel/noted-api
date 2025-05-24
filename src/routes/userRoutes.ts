import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers";
import { validateBody } from "../middleware/validateBody";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema";
import { validateParams } from "../middleware/validateParams";
import { idSchema } from "../schemas/idSchema";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validateBody(createUserSchema), createUser);
router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(updateUserSchema),
  updateUser
);
router.delete("/:id", validateParams(idSchema), deleteUser);

export default router;
