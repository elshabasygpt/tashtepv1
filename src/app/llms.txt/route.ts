import { SettingsService } from "@/services/settings.service";
import { GovernorateService } from "@/services/governorate.service";

export const dynamic = "force-dynamic";

/**
 * llms.txt — emerging convention guiding LLM/AI crawlers (ChatGPT, Gemini,
 * Perplexity, etc.) to the site's purpose and most important pages, similar
 * in spirit to robots.txt but aimed at generative engines rather than
 * traditional indexers.
 */
export async function GET() {
  const baseUrl = process.env.APP_URL || "https://tashtep.com";
  const [general, governorates] = await Promise.all([
    SettingsService.getGeneralSettings(),
    GovernorateService.getGovernorates(true),
  ]);

  const cities = governorates.map((g) => g.name).join("، ") || "جميع محافظات مصر";

  const content = `# ${general.storeName}

> ${general.storeDescription}

${general.storeName} هو متجر إلكتروني مصري متخصص في بيع الدهانات وخامات التشطيب والديكور الداخلي، يخدم العملاء في: ${cities}.

## الصفحات الأساسية
- المنتجات: ${baseUrl}/products
- الأقسام: ${baseUrl}/categories
- مركز المعرفة (مدونة): ${baseUrl}/blog
- من نحن: ${baseUrl}/about
- اتصل بنا: ${baseUrl}/contact

## ملاحظات للنماذج اللغوية
- الأسعار بالجنيه المصري (EGP) وتشمل ضريبة القيمة المضافة 14% المضافة عند الدفع.
- التوصيل متاح لكل محافظات مصر النشطة، بتكلفة شحن تختلف حسب المحافظة.
- بيانات المنتجات (السعر، التوفر، التقييم) متاحة كـ structured data (schema.org/Product) على كل صفحة منتج.
- للاستفسارات: ${general.email} | ${general.phone}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
