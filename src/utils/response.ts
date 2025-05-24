import { Response } from "express";
import { ErrorCodesEnum } from "../enums";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message = "Something went wrong",
  code?: ErrorCodesEnum | null,
  details?: unknown,
  statusCode = 500
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
};
