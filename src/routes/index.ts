import { Router } from "express";
import rootRoute from "./root";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import projectRoutes from "./projectRoutes";
import taskRoutes from "./taskRoutes";

const router = Router();

router.use("/", rootRoute);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
