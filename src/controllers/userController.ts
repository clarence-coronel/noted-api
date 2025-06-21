import { Request, Response } from "express";
import { verifyUserExists } from "../helper";
import { prisma, sendError, sendSuccess } from "../utils";
import { ErrorCodesEnum } from "../enums";
import { z } from "zod";
import { idSchema, updateUserSchema } from "../schemas";

const { user } = prisma;

export const updateUser = async (request: Request, response: Response) => {
  const { id } = request.params as z.infer<typeof idSchema>;
  const { displayName } = request.body as z.infer<typeof updateUserSchema>;

  const existingUser = await verifyUserExists({ identifier: "ID", id });
  if (!existingUser) {
    sendError({
      response,
      message: "User not found",
      code: ErrorCodesEnum.NOT_FOUND,
      statusCode: 404,
    });
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

  sendSuccess({
    response,
    data: updatedUser,
    message: "User updated successfully",
    statusCode: 201,
  });
};

export const deleteUser = async (request: Request, response: Response) => {
  const { id } = request.params as z.infer<typeof idSchema>;

  const existingUser = await verifyUserExists({ identifier: "ID", id });
  if (!existingUser) {
    sendError({
      response,
      message: "User not found",
      code: ErrorCodesEnum.NOT_FOUND,
      statusCode: 404,
    });
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

  sendSuccess({
    response,
    message: "User removed successfully",
    statusCode: 200,
  });
};
