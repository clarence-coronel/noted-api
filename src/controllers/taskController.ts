import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../utils";
import { z } from "zod";
import { createTaskSchema, idSchema, updateTaskSchema } from "../schemas";
import { ErrorCodesEnum } from "../enums";

// export const getAllTasks = async (request: Request, response: Response) => {
//   const ownedBy = request.user.userId;

//   const projects = await prisma.project.findMany({
//     where: {
//       ownedBy,
//       deletedAt: null, //do not include deleted projects
//     },
//   });

//   sendSuccess({ response, data: projects });
//   return;
// };

export const getTaskById = async (request: Request, response: Response) => {
  const { id } = request.params as z.infer<typeof idSchema>;

  const task = await prisma.task.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!task) {
    sendError({
      response,
      message: "Task not found",
      code: ErrorCodesEnum.NOT_FOUND,
      statusCode: 404,
    });
    return;
  }

  sendSuccess({ response, data: task });
  return;
};

export const createTask = async (request: Request, response: Response) => {
  const { title, projectId, status, type, priority, parentId } =
    request.body as z.infer<typeof createTaskSchema>;

  const newTask = await prisma.task.create({
    data: {
      title,
      projectId,
      status,
      type,
      priority,
      parentId,
    },
  });

  sendSuccess({ response, data: newTask, statusCode: 201 });
  return;
};

export const updateTask = async (request: Request, response: Response) => {
  const payload = request.body as z.infer<typeof updateTaskSchema>;
  const { id } = request.params as z.infer<typeof idSchema>;

  const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined)
  );

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...filteredPayload,
    },
  });

  sendSuccess({
    response,
    data: updatedTask,
  });
  return;
};

export const deleteTask = async (request: Request, response: Response) => {
  const { id } = request.params as z.infer<typeof idSchema>;

  await prisma.task.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  sendSuccess({
    response,
    statusCode: 204,
  });
  return;
};
