import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Username must be at least 1 character")
    .max(64, "Username cannot exceed 64 characters"),
});
