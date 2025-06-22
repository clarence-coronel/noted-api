import { z } from "zod";
import { TaskPriority, TaskStatus, TaskType } from "../../generated/prisma";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(64, "Title cannot exceed 64 characters"),
  projectId: z.string().uuid("Invalid UUID format"),
  status: z
    .nativeEnum(TaskStatus, {
      message: `Status must be one of: ${Object.values(TaskStatus).join(", ")}`,
    })
    .optional(),
  type: z
    .nativeEnum(TaskType, {
      message: `Type must be one of: ${Object.values(TaskType).join(", ")}`,
    })
    .optional(),
  priority: z
    .nativeEnum(TaskPriority, {
      message: `Priority must be one of: ${Object.values(TaskPriority).join(
        ", "
      )}`,
    })
    .optional(),
  parentId: z.string().uuid("Invalid UUID format").optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(64, "Title cannot exceed 64 characters")
    .optional(),
  projectId: z.string().uuid("Invalid UUID format").optional(),
  status: z
    .nativeEnum(TaskStatus, {
      message: `Status must be one of: ${Object.values(TaskStatus).join(", ")}`,
    })
    .optional(),
  type: z
    .nativeEnum(TaskType, {
      message: `Type must be one of: ${Object.values(TaskType).join(", ")}`,
    })
    .optional(),
  priority: z
    .nativeEnum(TaskPriority, {
      message: `Priority must be one of: ${Object.values(TaskPriority).join(
        ", "
      )}`,
    })
    .optional(),
  parentId: z.string().uuid("Invalid UUID format").optional(),
});
