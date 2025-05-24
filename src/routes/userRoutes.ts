import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers";
import { validateBody } from "../middleware/validateBody";
import { createUserSchema } from "../schemas/userSchema";
import { validateParams } from "../middleware/validateParams";
import { idSchema } from "../schemas/idSchema";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validateBody(createUserSchema), createUser);
router.put("/:id", validateParams(idSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
