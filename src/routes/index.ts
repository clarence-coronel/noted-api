import { Router } from "express";
import rootRoute from "./root";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/", rootRoute);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
