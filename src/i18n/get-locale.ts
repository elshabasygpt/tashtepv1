import { cookies } from "next/headers";
import type { Locale } from "./config";
import { defaultLocale, locales } from "./config";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("tashtep_locale")?.value;
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

export async function getMessages(locale: Locale) {
  if (locale === "en") {
    return (await import("../../messages/en.json")).default as Record<string, unknown>;
  }
  return (await import("../../messages/ar.json")).default as Record<string, unknown>;
}
