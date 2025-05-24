import { Router } from "express";
import userRoutes from "./userRoutes";
import rootRoute from "./root";

const router = Router();

router.use("/", rootRoute);
router.use("/users", userRoutes);

export default router;
