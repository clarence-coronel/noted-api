import { ErrorRequestHandler } from "express";
import { sendError } from "../utils";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  if (err.statusCode || err.code) {
    sendError({
      response: res,
      message: err.message || "An error occurred",
      code: err.code || null,
      details: err.details || null,
      statusCode: err.statusCode || 400,
    });
    return;
  }

  console.error(err);

  sendError({ response: res });
};
