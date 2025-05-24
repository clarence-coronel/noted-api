import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ErrorCodesEnum } from "../enums";
import { sendError } from "../utils";

export const validateBody =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      sendError(
        res,
        "Validation failed",
        ErrorCodesEnum.VALIDATION_ERROR,
        result.error.errors,
        400
      );
      return;
    }
    req.body = result.data;
    next();
  };
