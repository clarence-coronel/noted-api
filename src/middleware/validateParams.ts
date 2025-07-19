import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ErrorCodesEnum } from "../enums";
import { sendError } from "../utils";

export const validateParams = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      sendError({
        response: res,
        message: "Invalid URL parameters",
        code: ErrorCodesEnum.VALIDATION_ERROR,
        details: result.error.errors,
        statusCode: 400,
      });
      return;
    }

    next();
  };
};
