import { z } from "zod";
import { getCurrentUser, type SessionUser } from "./auth";
import { UserRole } from "@prisma/client";

export type ActionState<T> = {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[] | undefined>;
};

/**
 * Public Action Wrapper
 * Validates input using Zod before executing the handler.
 */
export function publicAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (parsedInput: TInput) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    try {
      const result = schema.safeParse(input);
      if (!result.success) {
        return {
          success: false,
          validationErrors: result.error.flatten().fieldErrors,
          error: "بيانات غير صالحة. يرجى التحقق من المدخلات.",
        };
      }
      
      const data = await handler(result.data);
      return { success: true, data };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      console.error("[publicAction] Error:", error);
      return { success: false, error: "حدث خطأ غير متوقع بالخادم." };
    }
  };
}

/**
 * Protected Action Wrapper
 * Ensures the user is logged in before parsing input and executing the handler.
 */
export function protectedAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (parsedInput: TInput, user: SessionUser) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return { success: false, error: "غير مصرح لك. يرجى تسجيل الدخول أولاً." };
      }

      const result = schema.safeParse(input);
      if (!result.success) {
        return {
          success: false,
          validationErrors: result.error.flatten().fieldErrors,
          error: "بيانات غير صالحة. يرجى التحقق من المدخلات.",
        };
      }
      
      const data = await handler(result.data, user);
      return { success: true, data };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      console.error("[protectedAction] Error:", error);
      return { success: false, error: "حدث خطأ غير متوقع بالخادم." };
    }
  };
}

/**
 * Role-Based Action Wrapper
 * Ensures the user is logged in AND has the correct role(s) before executing.
 */
export function roleAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  allowedRoles: UserRole[],
  handler: (parsedInput: TInput, user: SessionUser) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return { success: false, error: "غير مصرح لك. يرجى تسجيل الدخول أولاً." };
      }

      if (!allowedRoles.includes(user.role)) {
        return { success: false, error: "لا تملك الصلاحيات الكافية لإجراء هذه العملية." };
      }

      const result = schema.safeParse(input);
      if (!result.success) {
        return {
          success: false,
          validationErrors: result.error.flatten().fieldErrors,
          error: "بيانات غير صالحة. يرجى التحقق من المدخلات.",
        };
      }
      
      const data = await handler(result.data, user);
      return { success: true, data };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      console.error("[roleAction] Error:", error);
      return { success: false, error: "حدث خطأ غير متوقع بالخادم." };
    }
  };
}
