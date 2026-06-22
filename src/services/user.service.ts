import { User } from '@prisma/client';
import { prisma } from "@/lib/prisma";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export const UserService = {
  /**
   * Retrieve a user by their unique ID.
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      if (!user) throw new NotFoundError("المستخدم");
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to get user by id");
    }
  },

  /**
   * Retrieve a user by their email address.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) throw new NotFoundError("المستخدم");
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to get user by email");
    }
  },

  /**
   * Update a user's profile information.
   */
  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new DatabaseError("Failed to update user");
    }
  },

  /**
   * Soft delete or deactivate a user account.
   */
  async deactivateUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      throw new DatabaseError("Failed to deactivate user");
    }
  }
};
