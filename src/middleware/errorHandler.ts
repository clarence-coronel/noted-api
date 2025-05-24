import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { sendError } from "../utils/response";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): void => {
  if (err.statusCode || err.code) {
    sendError(
      res,
      err.message || "An error occurred",
      err.code || null,
      err.details || null,
      err.statusCode || 400
    );
    return;
  }

  console.error(err);

  sendError(res);
};
