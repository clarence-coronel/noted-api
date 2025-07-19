import { z } from "zod";

const displayNameSchema = z
  .string()
  .min(8, "Display name must be at least 8 characters")
  .max(64, "Display name cannot exceed 64 characters")
  .optional();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password cannot exceed 64 characters")
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine((val) => /[@$!%*?&()[\]{}^~#_+=|<>:;"',./\\-]/.test(val), {
    message: "Password must contain at least one special character",
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordSchema,
});

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username cannot exceed 32 characters")
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only include letters, numbers, and underscores",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Username must not contain spaces",
    }),

  password: passwordSchema,

  displayName: displayNameSchema,
});

export const updateUserSchema = z.object({
  displayName: displayNameSchema,
});
