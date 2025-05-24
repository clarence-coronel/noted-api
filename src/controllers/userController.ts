import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { sendError, sendSuccess } from "../utils/response";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";
import { hashPassword } from "../utils/bcrypt";

const { user } = prisma;

export const getAllUsers = (req: Request, res: Response) => {
  res.send("Get All Users.");
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, displayName } = req.body;

  const existingUser = await user.findUnique({
    where: { username },
  });

  if (existingUser) {
    sendError(
      res,
      "Username already taken",
      ErrorCodesEnum.CONFLICT,
      null,
      409
    );
    return;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await user.create({
    data: {
      username,
      password: hashedPassword,
      displayName,
    },
    select: {
      username: true,
      displayName: true,
    },
  });

  sendSuccess(res, newUser, "User created successfully", 201);
};

export const updateUser = async (req: Request, res: Response) => {
  const { displayName } = req.body;

  const id = req.params.id;

  const existingUser = await user.findUnique({
    where: { id },
  });

  throw new Error("TEST");

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

  sendSuccess(res, updatedUser, "User created successfully", 201);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};
