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
  });

  const { password: _, ...safeUser } = newUser;

  sendSuccess(res, safeUser, "User created successfully", 201);
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};
