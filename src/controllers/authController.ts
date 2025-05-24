import { Request, Response } from "express";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";
import { sendError, sendSuccess } from "../utils/response";
import { hashPassword, prisma } from "../utils";

const { user } = prisma;

export const register = async (req: Request, res: Response) => {
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
