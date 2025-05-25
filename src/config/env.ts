import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const PORT = process.env.PORT || 3000;
export const ENVIRONMENT = process.env.ENVIRONMENT || "development";
export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");
