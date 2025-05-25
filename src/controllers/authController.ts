import { Request, Response } from "express";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";
import { sendError, sendSuccess } from "../utils/response";
import {
  hashPassword,
  prisma,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from "../utils";
import { verifyUserExists } from "../helper";
import {
  convertJwtTimeToMs,
  ENVIRONMENT,
  REFRESH_TOKEN_EXPIRES,
} from "../config";

const { user } = prisma;

export const register = async (req: Request, res: Response) => {
  const { username, password, displayName } = req.body;

  const existingUser = await user.findUnique({ where: { username } });

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
      id: true,
      username: true,
      displayName: true,
    },
  });

  // Generate tokens
  const payload = {
    userId: newUser.id,
    username: newUser.username,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Set refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENVIRONMENT === "production",
    sameSite: "strict",
    maxAge: convertJwtTimeToMs(REFRESH_TOKEN_EXPIRES),
  });

  sendSuccess(
    res,
    {
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
      },
      accessToken,
    },
    "User created successfully",
    201
  );
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    sendError(
      res,
      "Username and password are required",
      ErrorCodesEnum.BAD_REQUEST,
      null,
      400
    );
    return;
  }

  const existingUser = await verifyUserExists({
    identifier: "USERNAME",
    username,
  });

  if (!existingUser) {
    sendError(
      res,
      "Invalid credentials",
      ErrorCodesEnum.UNAUTHORIZED,
      null,
      401
    );
    return;
  }

  const verified = await verifyPassword(password, existingUser.password);

  if (!verified) {
    sendError(
      res,
      "Invalid credentials",
      ErrorCodesEnum.UNAUTHORIZED,
      null,
      401
    );
    return;
  }

  // Generate tokens
  const payload = {
    userId: existingUser.id,
    username: existingUser.username,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Set refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: convertJwtTimeToMs(REFRESH_TOKEN_EXPIRES),
  });

  sendSuccess(
    res,
    {
      user: {
        id: existingUser.id,
        username: existingUser.username,
        displayName: existingUser.displayName,
      },
      accessToken,
    },
    "Login successful",
    200
  );
};

export const logout = async (req: Request, res: Response) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  sendSuccess(res, null, "Logged out successfully", 200);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    sendError(
      res,
      "Refresh token not provided",
      ErrorCodesEnum.UNAUTHORIZED,
      null,
      401
    );
    return;
  }

  // Verify the refresh token
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || typeof decoded === "string") {
    sendError(
      res,
      "Invalid refresh token",
      ErrorCodesEnum.UNAUTHORIZED,
      null,
      401
    );
    return;
  }

  // Extract user info from token
  const { userId, username } = decoded as {
    userId: string;
    username: string;
  };

  // Verify user still exists in database
  const existingUser = await user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  });

  if (!existingUser) {
    sendError(res, "User not found", ErrorCodesEnum.NOT_FOUND, null, 404);
    return;
  }

  // Generate new tokens
  const payload = {
    userId: existingUser.id,
    username: existingUser.username,
  };

  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  // Set new refresh token as httpOnly cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  // Return new access token
  sendSuccess(
    res,
    {
      accessToken: newAccessToken,
      user: {
        id: existingUser.id,
        username: existingUser.username,
        displayName: existingUser.displayName,
      },
    },
    "Token refreshed successfully",
    200
  );
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  if (!userId) {
    sendError(res, "Unauthorized", ErrorCodesEnum.UNAUTHORIZED, null, 401);
    return;
  }

  const currentUser = await user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!currentUser) {
    sendError(res, "User not found", ErrorCodesEnum.NOT_FOUND, null, 404);
    return;
  }

  sendSuccess(res, currentUser, "User retrieved successfully", 200);
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId) {
    sendError(res, "Unauthorized", ErrorCodesEnum.UNAUTHORIZED, null, 401);
    return;
  }

  // Get user with password
  const existingUser = await verifyUserExists({
    identifier: "ID",
    id: userId,
  });

  if (!existingUser) {
    sendError(res, "User not found", ErrorCodesEnum.NOT_FOUND, null, 404);
    return;
  }

  // Verify current password
  const isCurrentPasswordValid = await verifyPassword(
    currentPassword,
    existingUser.password
  );

  if (!isCurrentPasswordValid) {
    sendError(
      res,
      "Current password is incorrect",
      ErrorCodesEnum.UNAUTHORIZED,
      null,
      401
    );
    return;
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  sendSuccess(res, null, "Password changed successfully", 200);
};
