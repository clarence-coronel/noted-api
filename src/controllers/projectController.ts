import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../utils";
import { z } from "zod";
import { createProjectSchema } from "../schemas";

const { project } = prisma;

export const createProject = async (req: Request, res: Response) => {
  const { title } = req.body as z.infer<typeof createProjectSchema>;
  const ownedBy = req.user?.userId;

  console.log({ title, ownedBy });
};
