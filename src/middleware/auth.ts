import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";
import { verifyAccessToken } from "../utils";

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
      sendError({
        response: res,
        message:
          "Invalid authorization header format. Expected 'Bearer <token>'.",
        code: ErrorCodesEnum.UNAUTHORIZED,
        details: null,
        statusCode: 401,
      });
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

  sendError({
    response: res,
    message: "Session expired or invalid. Please log in again.",
    code: ErrorCodesEnum.UNAUTHORIZED,
    details: null,
    statusCode: 401,
  });
};
