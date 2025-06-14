import { Request, Response } from "express";
import { verifyUserExists } from "../helper";
import { prisma, sendError, sendSuccess } from "../utils";
import { ErrorCodesEnum } from "../enums";
import { z } from "zod";
import { idSchema, updateUserSchema } from "../schemas";

const { user } = prisma;

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params as z.infer<typeof idSchema>;
  const { displayName } = req.body as z.infer<typeof updateUserSchema>;

  const existingUser = await verifyUserExists({ identifier: "ID", id });
  if (!existingUser) {
    sendError(res, "User not found", ErrorCodesEnum.NOT_FOUND, null, 404);
    return;
  }

  const updatedUser = await user.update({
    where: {
      id,
    },
    data: {
      displayName,
    },
    select: {
      username: true,
      displayName: true,
    },
  });

  sendSuccess(res, updatedUser, "User updated successfully", 201);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params as z.infer<typeof idSchema>;

  const existingUser = await verifyUserExists({ identifier: "ID", id });
  if (!existingUser) {
    sendError(res, "User not found", ErrorCodesEnum.NOT_FOUND, null, 404);
    return;
  }

  await user.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  sendSuccess(res, null, "User removed successfully", 200);
};
