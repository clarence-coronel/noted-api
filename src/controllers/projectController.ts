import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../utils";
import { z } from "zod";
import { createProjectSchema, idSchema } from "../schemas";
import { ErrorCodesEnum } from "../enums";

export const getAllProjects = async (request: Request, response: Response) => {
  const ownedBy = request.user.userId;

  const projects = await prisma.project.findMany({
    where: {
      ownedBy,
      deletedAt: null, //do not include deleted projects
    },
  });

  sendSuccess({ response, data: projects });
  return;
};

export const getProjectById = async (request: Request, response: Response) => {
  const { id } = request.params as z.infer<typeof idSchema>;

  const project = await prisma.project.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!project) {
    sendError({
      response,
      message: "Project not found",
      code: ErrorCodesEnum.NOT_FOUND,
      statusCode: 404,
    });
    return;
  }

  sendSuccess({ response, data: project });
  return;
};

export const createProject = async (request: Request, response: Response) => {
  const { title } = request.body as z.infer<typeof createProjectSchema>;
  const ownedBy = request.user.userId;

  const newProject = await prisma.project.create({
    data: {
      title,
      ownedBy,
    },
  });

  sendSuccess({ response, data: newProject, statusCode: 201 });
  return;
};

export const updateProject = async (request: Request, response: Response) => {
  const { title } = request.body as z.infer<typeof createProjectSchema>;
  const { id } = request.params as z.infer<typeof idSchema>;

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      title,
    },
  });

  sendSuccess({
    response,
    data: updatedProject,
  });
  return;
};

export const deleteProject = async (request: Request, response: Response) => {
  const { id } = request.params as z.infer<typeof idSchema>;

  await prisma.project.update({
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
