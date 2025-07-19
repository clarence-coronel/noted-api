import { Router } from "express";
import { deleteUser, updateUser } from "../controllers";
import { idSchema, updateUserSchema } from "../schemas";
import { validateBody, validateParams } from "../middleware";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(updateUserSchema),
  updateUser
);

router.delete("/:id", validateParams(idSchema), deleteUser);

export default router;
