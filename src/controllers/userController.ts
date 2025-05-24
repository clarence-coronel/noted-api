import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { sendError, sendSuccess } from "../utils/response";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";
import { hashPassword } from "../utils/bcrypt";
import { verifyUserExists } from "../helper/userHelper";

const { user } = prisma;

export const getAllUsers = (req: Request, res: Response) => {
  res.send("Get All Users.");
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { displayName } = req.body;

  const existingUser = await verifyUserExists(id, res);
  if (!existingUser) return;

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

  const existingUser = await verifyUserExists(id, res);
  if (!existingUser) return;

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
