import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
} from "../config";

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    return null;
  }
};
