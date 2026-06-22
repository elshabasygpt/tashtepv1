import { z } from "zod";
import { logger } from "@/lib/logger";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  PAYMOB_API_KEY: z.string().min(1),
  PAYMOB_INTEGRATION_ID: z.string().min(1),
  PAYMOB_IFRAME_ID: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  // Optional depending on setup, but the prompt says they are critical
  // If user does not have Google Client ID locally, it might crash.
  // The instructions explicitly require them to be validated.
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error(
    { errors: parsed.error.format() },
    "❌ Invalid environment variables"
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
