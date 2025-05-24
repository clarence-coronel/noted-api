import { Router, Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    service: "noted-api",
    status: "ok",
    version: "0.0.1-dev",
  });
});

export default router;
