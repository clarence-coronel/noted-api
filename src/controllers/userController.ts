import { Request, Response } from "express";

export const getAllUsers = (req: Request, res: Response) => {
  res.send("Get All Users.");
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};

export const createUser = (req: Request, res: Response) => {
  res.send("Create user.");
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;

  res.send("ID: " + id);
};
