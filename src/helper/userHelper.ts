import prisma from "../utils/prisma";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";
import { sendError } from "../utils/response";
import { Response } from "express";

const { user } = prisma;

export const verifyUserExists = async (id: string, res: Response) => {
  // Find user and only return if active
  const existingUser = await user.findUnique({ where: { id, isActive: true } });

  if (!existingUser) {
    sendError(res, "User not found", ErrorCodesEnum.NOT_FOUND, null, 404);
    return null;
  }

  return existingUser;
};
