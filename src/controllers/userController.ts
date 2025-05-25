import { Request, Response } from "express";
import { verifyUserExists } from "../helper";
import { prisma, sendError, sendSuccess } from "../utils";
import { ErrorCodesEnum } from "../enums";

const { user } = prisma;

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { displayName } = req.body;

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
  const { id } = req.params;

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
