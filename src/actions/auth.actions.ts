"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { publicAction, protectedAction } from "@/lib/safe-action";
import { rateLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { UserService } from "@/services/user.service";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { EmailService } from "@/lib/email";
import { logger } from "@/lib/logger";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirectTo: z.string().optional()
});

export const loginAction = publicAction(
  loginSchema,
  async (parsedInput) => {
    // 1. Rate Limiting (5 requests / minute)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`login:${ip}`, { maxRequests: 5, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من المحاولات. يرجى المحاولة بعد قليل.");
    }

    // 2. Lockout Check
    const isLocked = await rateLimiter.checkLockout(parsedInput.email);
    if (isLocked) {
      throw new Error("بيانات الدخول غير صحيحة"); // Generic error for OpSec
    }

    try {
      await signIn("credentials", {
        email: parsedInput.email,
        password: parsedInput.password,
        redirect: false,
      });

      // Reset Lockout on success
      await rateLimiter.resetLoginLockout(parsedInput.email);

      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin") {
          // Record failed login
          const lockoutResult = await rateLimiter.recordFailedLogin(parsedInput.email);
          if (lockoutResult.locked) {
            logger.warn({ email: parsedInput.email }, "[SECURITY] Account locked due to multiple failed login attempts");
          }
          throw new Error("بيانات الدخول غير صحيحة");
        }
        throw new Error("حدث خطأ أثناء تسجيل الدخول");
      }
      throw error;
    }
  }
);

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerAction = publicAction(
  registerSchema,
  async (parsedInput) => {
    // 1. Rate Limiting (3 requests / minute)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`register:${ip}`, { maxRequests: 3, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من المحاولات. يرجى المحاولة بعد قليل.");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedInput.email }
    });

    if (existingUser) {
      throw new Error("البريد الإلكتروني مسجل مسبقاً");
    }

    const passwordHash = await bcrypt.hash(parsedInput.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsedInput.name,
        email: parsedInput.email,
        passwordHash,
      }
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token,
        expires,
      }
    });

    await EmailService.sendVerificationEmail(user.email!, user.name || "عزيزي العميل", token);
    logger.info({ userId: user.id }, "Verification email sent");

    // Welcome email (fire-and-forget)
    EmailService.sendWelcomeEmail(user.email!, user.name || "عزيزي العميل").catch(() => {});

    return { success: true };
  }
);

const updateProfileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صالح").optional().or(z.literal("")),
});

export const updateProfileAction = protectedAction(
  updateProfileSchema,
  async (parsedInput, user) => {
    // 1. Rate Limiting (5 requests / minute)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`updateProfile:${ip}`, { maxRequests: 5, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من الطلبات. يرجى الانتظار قليلاً.");
    }

    // Check if email or phone is already taken by ANOTHER user
    if (parsedInput.email !== user.email) {
      const existingEmail = await UserService.getUserByEmail(parsedInput.email).catch(() => null);
      if (existingEmail && existingEmail.id !== user.id) {
        throw new Error("البريد الإلكتروني مسجل مسبقاً لمستخدم آخر.");
      }
    }

    // Phone checking should be added if Phone is unique in DB
    // Currently assuming schema handles it or we let Prisma throw if unique constraint fails

    try {
      await UserService.updateUser(user.id, {
        name: parsedInput.name,
        email: parsedInput.email,
        phone: parsedInput.phone || null,
      });

      revalidatePath("/account/profile");
      return { success: true };
    } catch {
      throw new Error("حدث خطأ أثناء تحديث البيانات.");
    }
  }
);

const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export const requestPasswordResetAction = publicAction(
  forgotPasswordSchema,
  async (parsedInput) => {
    // 1. Rate Limiting (3 requests / minute)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`forgotPass:${ip}`, { maxRequests: 3, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من الطلبات. يرجى الانتظار قليلاً.");
    }

    const user = await UserService.getUserByEmail(parsedInput.email).catch(() => null);

    // Always return success to prevent email enumeration attacks
    if (!user) return { success: true };

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Clean up old tokens for this user first
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email! }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token,
        expires,
      }
    });

    await EmailService.sendPasswordResetEmail(user.email!, token);
    logger.info({ userId: user.id }, "Password reset email sent");

    return { success: true };
  }
);

const resetPasswordSchema = z.object({
  token: z.string().min(1, "رمز التوثيق مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const resetPasswordAction = publicAction(
  resetPasswordSchema,
  async (parsedInput) => {
    // 1. Rate Limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`resetPass:${ip}`, { maxRequests: 3, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من الطلبات.");
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: parsedInput.token }
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new Error("رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.");
    }

    const user = await UserService.getUserByEmail(verificationToken.identifier).catch(() => null);

    if (!user) {
      throw new Error("المستخدم غير موجود.");
    }

    const passwordHash = await bcrypt.hash(parsedInput.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    // Delete token after use
    await prisma.verificationToken.delete({
      where: { token: parsedInput.token }
    });

    return { success: true };
  }
);

const verifyEmailSchema = z.object({
  token: z.string().min(1, "رمز التوثيق مطلوب"),
});

export const verifyEmailAction = publicAction(
  verifyEmailSchema,
  async (parsedInput) => {
    // 1. Rate Limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`verifyEmail:${ip}`, { maxRequests: 5, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من الطلبات.");
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: parsedInput.token }
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new Error("رابط التوثيق غير صالح أو منتهي الصلاحية.");
    }

    const user = await UserService.getUserByEmail(verificationToken.identifier).catch(() => null);

    if (!user) {
      throw new Error("المستخدم غير موجود.");
    }

    if (user.emailVerified) {
      // Already verified, just clean up
      await prisma.verificationToken.delete({
        where: { token: parsedInput.token }
      });
      return { success: true };
    }

    // Verify email
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    });

    // Delete token after use
    await prisma.verificationToken.delete({
      where: { token: parsedInput.token }
    });

    return { success: true };
  }
);

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
});

export const changePasswordAction = protectedAction(
  changePasswordSchema,
  async (parsedInput, user) => {
    // 1. Rate Limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`changePass:${ip}`, { maxRequests: 5, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من الطلبات.");
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser || !dbUser.passwordHash) {
      throw new Error("حدث خطأ غير متوقع.");
    }

    const isValid = await bcrypt.compare(parsedInput.currentPassword, dbUser.passwordHash);
    
    if (!isValid) {
      throw new Error("كلمة المرور الحالية غير صحيحة.");
    }

    const passwordHash = await bcrypt.hash(parsedInput.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    return { success: true };
  }
);
