import { Metadata } from "next";
import { GovernorateService } from "@/services/governorate.service";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "الشحن والتوصيل",
  description: "تعرف على تكاليف الشحن والتوصيل لجميع محافظات مصر الـ 27. توصيل سريع وآمن.",
  alternates: { canonical: "/shipping" },
};

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  const governorates = await GovernorateService.getGovernorates(true);

  const sorted = [...governorates].sort((a, b) => a.shippingCost - b.shippingCost);

  return (
    <Section className="min-h-screen bg-white py-macro-md md:py-macro-lg">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-macro-sm">
            <h1 className="font-display-hero-mobile md:font-display-hero text-[32px] md:text-[40px] text-obsidian mb-3">
              الشحن والتوصيل
            </h1>
            <p className="text-secondary font-body-lg">
              نوصّل لجميع محافظات مصر الـ 27. يُحسب سعر الشحن تلقائياً عند إتمام الطلب.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-macro-sm">
            {[
              { icon: "local_shipping", title: "توصيل سريع", desc: "2–5 أيام عمل لمعظم المحافظات" },
              { icon: "inventory_2",    title: "تتبع الطلب",  desc: "تتبع شحنتك بعد التأكيد" },
              { icon: "support_agent", title: "دعم كامل",    desc: "فريق الدعم متاح 7 أيام" },
            ].map(c => (
              <div key={c.icon} className="rounded-2xl border border-soft-border p-5 flex flex-col gap-2">
                <span className="material-symbols-outlined text-tashtep-orange text-3xl">{c.icon}</span>
                <p className="font-label-md font-bold text-obsidian">{c.title}</p>
                <p className="text-secondary text-sm">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Governorate Table */}
          <div className="rounded-2xl border border-soft-border overflow-hidden">
            <div className="bg-stone/40 px-5 py-3 flex items-center justify-between">
              <h2 className="font-headline-sm text-obsidian">تكاليف الشحن بالمحافظة</h2>
              <span className="text-secondary text-sm">{sorted.length} محافظة</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-soft-border bg-stone/20">
                  <th className="text-right px-5 py-3 font-label-md text-secondary text-sm">المحافظة</th>
                  <th className="text-left px-5 py-3 font-label-md text-secondary text-sm">تكلفة الشحن</th>
                  <th className="text-left px-5 py-3 font-label-md text-secondary text-sm">المدة التقريبية</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((gov, i) => {
                  const days = gov.shippingCost <= 35 ? "1–2 يوم" : gov.shippingCost <= 55 ? "2–3 أيام" : gov.shippingCost <= 70 ? "3–4 أيام" : "4–5 أيام";
                  return (
                    <tr key={gov.id} className={`border-b border-soft-border last:border-0 ${i % 2 === 0 ? "" : "bg-stone/10"}`}>
                      <td className="px-5 py-3 font-body-md text-obsidian">{gov.name}</td>
                      <td className="px-5 py-3 font-label-md font-bold text-tashtep-orange">{gov.shippingCost} ج.م</td>
                      <td className="px-5 py-3 text-secondary text-sm">{days}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-stone/30 border border-soft-border text-secondary text-sm leading-relaxed">
            <p className="font-bold text-obsidian mb-2">ملاحظات هامة</p>
            <ul className="list-disc list-inside space-y-1">
              <li>الشحن مجاناً على الطلبات التي تتجاوز 2000 ج.م (القاهرة والجيزة فقط)</li>
              <li>الأوقات المذكورة تقديرية ولا تشمل أيام الجمعة والأعياد الرسمية</li>
              <li>يتم التواصل معك لتأكيد الطلب قبل الشحن</li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
