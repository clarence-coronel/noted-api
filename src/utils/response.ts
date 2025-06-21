import { Response } from "express";
import { ErrorCodesEnum } from "../enums";

interface SendSuccessOptions<T> {
  response: Response;
  data?: T | null;
  message?: string;
  statusCode?: number;
}

interface SendErrorOptions {
  response: Response;
  message?: string;
  code?: ErrorCodesEnum | null;
  details?: unknown;
  statusCode?: number;
}

export const sendSuccess = <T>({
  response,
  data = null,
  message = "Success",
  statusCode = 200,
}: SendSuccessOptions<T>): Response => {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = ({
  response,
  message = "Something went wrong",
  code = null,
  details = null,
  statusCode = 500,
}: SendErrorOptions): Response => {
  return response.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
};
