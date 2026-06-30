"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { SettingsService, AboutPageContent, HomePageHero, GeneralSettings, ContactPageContent, EmailSettings } from "@/services/settings.service";
import { EmailService } from "@/lib/email";

export async function updateAboutPageAction(data: AboutPageContent) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك للقيام بهذا الإجراء" };
    }

    await SettingsService.saveAboutPageContent(data);
    
    // Revalidate the about page to show new content immediately
    revalidatePath("/about");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating about page:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return { success: false, error: message };
  }
}

export async function updateHomePageHeroAction(data: HomePageHero) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك للقيام بهذا الإجراء" };
    }

    await SettingsService.saveHomePageHero(data);
    
    revalidatePath("/");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating home page:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return { success: false, error: message };
  }
}

export async function updateGeneralSettingsAction(data: GeneralSettings) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك للقيام بهذا الإجراء" };
    }

    await SettingsService.saveGeneralSettings(data);
    
    // Revalidate the entire layout as footer is everywhere
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating general settings:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return { success: false, error: message };
  }
}

export async function updateContactPageAction(data: ContactPageContent) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك للقيام بهذا الإجراء" };
    }

    await SettingsService.saveContactPageContent(data);

    revalidatePath("/contact");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating contact page:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return { success: false, error: message };
  }
}

export async function updateEmailSettingsAction(data: EmailSettings) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك للقيام بهذا الإجراء" };
    }

    await SettingsService.saveEmailSettings(data);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating email settings:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return { success: false, error: message };
  }
}

export async function testSmtpAction() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك للقيام بهذا الإجراء" };
    }

    const result = await EmailService.testSmtpConnection();
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return { success: false, error: message };
  }
}

export async function sendReplyAction(data: {
  to: string;
  customerName: string;
  originalSubject: string;
  replyBody: string;
  messageId?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك للقيام بهذا الإجراء" };
    }

    await EmailService.sendReplyToCustomer({
      to: data.to,
      customerName: data.customerName,
      originalSubject: data.originalSubject,
      replyBody: data.replyBody,
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return { success: false, error: message };
  }
}
