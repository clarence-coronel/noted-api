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
  let accessToken: string | null = null;

  // Check authorization header format
  if (authHeader) {
    const parts = authHeader.split(" ");

    // Check if it's a proper Bearer token format
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer" && parts[1]) {
      accessToken = parts[1];
    } else {
      sendError(
        res,
        "Invalid authorization header format. Expected 'Bearer <token>'.",
        ErrorCodesEnum.UNAUTHORIZED,
        null,
        401
      );
      return;
    }
  }

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
    const { exp, iat, ...cleanPayload } = decodedRefresh;
    const newAccessToken = signAccessToken(cleanPayload);

    // Send new access token via header (you can also set it in cookie if preferred)
    res.setHeader("x-access-token", newAccessToken);

    (req as any).user = decodedRefresh;
    return next();
  }

  sendError(
    res,
    "Session expired or invalid. Please log in again.",
    ErrorCodesEnum.UNAUTHORIZED,
    null,
    401
  );
};
