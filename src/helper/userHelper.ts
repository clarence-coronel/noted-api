import { prisma } from "../utils";

const { user } = prisma;

export const verifyUserExists = async ({
  identifier,
  id,
  username,
}: {
  identifier: "ID" | "USERNAME";
  id?: string;
  username?: string;
}) => {
  let existingUser = null;

  if (identifier === "ID") {
    if (!id) throw new Error("ID is required when identifier is 'ID'");
    existingUser = await user.findUnique({ where: { id } });
  } else if (identifier === "USERNAME") {
    if (!username)
      throw new Error("Username is required when identifier is 'USERNAME'");
    existingUser = await user.findUnique({ where: { username } });
  }

  // Return null if not found or inactive
  if (!existingUser || !existingUser.isActive) return null;

  return existingUser;
};
