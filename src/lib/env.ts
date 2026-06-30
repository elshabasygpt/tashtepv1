import { z } from "zod";
import { logger } from "@/lib/logger";

const envSchema = z.object({
  DATABASE_URL:   z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  // Payment — optional in dev; required in production
  PAYMOB_API_KEY:        z.string().optional(),
  PAYMOB_INTEGRATION_ID: z.string().optional(),
  PAYMOB_IFRAME_ID:      z.string().optional(),
  // Email — optional; emails are silently skipped when missing
  RESEND_API_KEY: z.string().optional(),
  // OAuth — optional; Google login is hidden when missing
  GOOGLE_CLIENT_ID:     z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error({ errors: parsed.error.format() }, "❌ Invalid environment variables");
  throw new Error("Invalid environment variables");
}

// Warn about missing optional services (only in server context)
if (typeof window === "undefined") {
  const d = parsed.data;
  if (!d.PAYMOB_API_KEY)        logger.warn("PAYMOB_API_KEY not set — card payments disabled");
  if (!d.RESEND_API_KEY)        logger.warn("RESEND_API_KEY not set — emails will be skipped");
  if (!d.GOOGLE_CLIENT_ID)      logger.warn("GOOGLE_CLIENT_ID not set — Google login disabled");
}

export const env = parsed.data;
