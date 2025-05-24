import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/response";
import { ErrorCodesEnum } from "../enums/errorCodesEnum";

export const validateParams = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      sendError(
        res,
        "Invalid URL parameters",
        ErrorCodesEnum.VALIDATION_ERROR,
        result.error.errors,
        400
      );
      return;
    }

    next();
  };
};
