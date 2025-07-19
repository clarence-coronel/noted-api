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
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
} from "../schemas";
import { z } from "zod";

const { user } = prisma;

export const register = async (request: Request, response: Response) => {
  const { username, password, displayName } = request.body as z.infer<
    typeof createUserSchema
  >;

  const existingUser = await user.findUnique({ where: { username } });

  if (existingUser) {
    sendError({
      response,
      message: "Username already taken",
      code: ErrorCodesEnum.CONFLICT,
      statusCode: 409,
    });
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
  response.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENVIRONMENT === "production",
    sameSite: "strict",
    maxAge: convertJwtTimeToMs(REFRESH_TOKEN_EXPIRES),
  });

  sendSuccess({
    response,
    data: {
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
      },
      accessToken,
    },
    message: "User created successfully",
    statusCode: 201,
  });
};

export const login = async (request: Request, response: Response) => {
  const { username, password } = request.body as z.infer<typeof loginSchema>;

  // Validate input
  if (!username || !password) {
    sendError({
      response,
      message: "Username and password are required",
      code: ErrorCodesEnum.BAD_REQUEST,
      statusCode: 400,
    });
    return;
  }

  const existingUser = await verifyUserExists({
    identifier: "USERNAME",
    username,
  });

  if (!existingUser) {
    sendError({
      response,
      message: "Invalid credentials",
      code: ErrorCodesEnum.UNAUTHORIZED,
      statusCode: 401,
    });
    return;
  }

  const verified = await verifyPassword(password, existingUser.password);

  if (!verified) {
    sendError({
      response,
      message: "Invalid credentials",
      code: ErrorCodesEnum.UNAUTHORIZED,
      statusCode: 401,
    });
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
  response.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: convertJwtTimeToMs(REFRESH_TOKEN_EXPIRES),
  });

  sendSuccess({
    response,
    data: {
      user: {
        id: existingUser.id,
        username: existingUser.username,
        displayName: existingUser.displayName,
      },
      accessToken,
    },
    message: "Login successful",
    statusCode: 200,
  });
};

export const logout = async (request: Request, response: Response) => {
  // Clear the refresh token cookie
  response.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  sendSuccess({
    response,
    message: "Logged out successfully",
    statusCode: 200,
  });
};

export const getNewAccessToken = async (
  request: Request,
  response: Response
) => {
  const { refreshToken } = request.cookies;

  if (!refreshToken) {
    sendError({
      response,
      message: "Refresh token not provided",
      code: ErrorCodesEnum.UNAUTHORIZED,
      statusCode: 401,
    });
    return;
  }

  // Verify the refresh token
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || typeof decoded === "string") {
    sendError({
      response,
      message: "Invalid refresh token",
      code: ErrorCodesEnum.UNAUTHORIZED,

      statusCode: 401,
    });
    return;
  }

  // Extract user info from token
  const { userId } = decoded as {
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
    sendError({
      response,
      message: "User not found",
      code: ErrorCodesEnum.NOT_FOUND,
      statusCode: 404,
    });
    return;
  }

  // Generate new tokens
  const payload = {
    userId: existingUser.id,
    username: existingUser.username,
  };

  const newAccessToken = signAccessToken(payload);

  // Return new access token
  sendSuccess({
    response,
    data: {
      user: {
        id: existingUser.id,
        username: existingUser.username,
        displayName: existingUser.displayName,
      },
      accessToken: newAccessToken,
    },
    message: "Access token refreshed successfully",
    statusCode: 200,
  });
};

export const getMe = async (request: Request, response: Response) => {
  const userId = request.user.userId;

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
    sendError({
      response,
      message: "User not found",
      code: ErrorCodesEnum.NOT_FOUND,
      statusCode: 404,
    });
    return;
  }

  sendSuccess({
    response,
    data: currentUser,
    message: "User retrieved successfully",
    statusCode: 200,
  });
};

export const changePassword = async (request: Request, response: Response) => {
  const { currentPassword, newPassword } = request.body as z.infer<
    typeof changePasswordSchema
  >;

  const userId = (request as any).user?.userId;

  if (!userId) {
    sendError({
      response,
      message: "Unauthorized",
      code: ErrorCodesEnum.UNAUTHORIZED,
      statusCode: 401,
    });
    return;
  }

  // Get user with password
  const existingUser = await verifyUserExists({
    identifier: "ID",
    id: userId,
  });

  if (!existingUser) {
    sendError({
      response,
      message: "User not found",
      code: ErrorCodesEnum.NOT_FOUND,
      statusCode: 404,
    });
    return;
  }

  // Verify current password
  const isCurrentPasswordValid = await verifyPassword(
    currentPassword,
    existingUser.password
  );

  if (!isCurrentPasswordValid) {
    sendError({
      response,
      message: "Current password is incorrect",
      code: ErrorCodesEnum.UNAUTHORIZED,
      statusCode: 401,
    });
    return;
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  sendSuccess({
    response,
    message: "Password changed successfully",
    statusCode: 200,
  });
};
