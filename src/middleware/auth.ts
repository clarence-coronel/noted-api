import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
} from "../utils";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  const unauthorized = (message: string) => {
    sendError(res, message, ErrorCodesEnum.UNAUTHORIZED, null, 401);
  };

  // First try validating access token
  const decodedAccess = accessToken && verifyAccessToken(accessToken);

  if (decodedAccess && typeof decodedAccess !== "string") {
    (req as any).user = decodedAccess;
    next();
    return;
  }

  // If access token invalid or expired, try refreshing using refresh token
  const refreshToken = req.cookies?.refreshToken;
  const decodedRefresh = refreshToken && verifyRefreshToken(refreshToken);

  if (decodedRefresh && typeof decodedRefresh !== "string") {
    const newAccessToken = signAccessToken({ ...decodedRefresh });

    // Send new access token via header (you can also set it in cookie if preferred)
    res.setHeader("x-access-token", newAccessToken);

    (req as any).user = decodedRefresh;
    return next();
  }

  return unauthorized("Session expired or invalid. Please log in again.");
};
