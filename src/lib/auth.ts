import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  image?: string | null;
};

/**
 * Retrieves the current authenticated user from the request.
 * Uses NextAuth v5 session.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email as string,
    role: session.user.role as UserRole,
    name: session.user.name,
    image: session.user.image,
  };
}
