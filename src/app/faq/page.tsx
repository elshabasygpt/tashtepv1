import { Metadata } from "next";
import { FaqSection } from "@/components/seo/faq-section";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description:
    "إجابات شاملة على أكثر الأسئلة شيوعاً حول تشطيب: المنتجات، الشحن والتوصيل لجميع محافظات مصر، طرق الدفع، سياسة الإرجاع، ونصائح اختيار الدهانات والتشطيبات.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "الأسئلة الشائعة | تشطيب",
    description: "إجابات على كل أسئلتك حول المنتجات والشحن والدفع والإرجاع في تشطيب.",
    type: "website",
  },
};

const PRODUCTS_FAQS = [
  {
    question: "ما هي تشطيب وماذا تبيع؟",
    answer:
      "تشطيب هي منصة تجارة إلكترونية مصرية متخصصة في بيع خامات التشطيب والديكور الداخلي، تشمل: الدهانات الداخلية والخارجية، ورق الحائط، الأرضيات، ومواد التشطيب المتنوعة. نحمل أشهر الماركات العالمية والمحلية مثل Jotun وGLC وSCIB وSIPES وNational Paints.",
  },
  {
    question: "هل المنتجات أصلية ومضمونة؟",
    answer:
      "نعم، جميع منتجاتنا أصلية 100% ومصدرها مباشرة من الموزعين المعتمدين والمصنّعين. نضمن جودة كل منتج، وفي حالة وصول أي منتج تالف أو غير مطابق للوصف يمكنك إرجاعه خلال 14 يوماً.",
  },
  {
    question: "كيف أعرف كمية الدهان التي أحتاجها لغرفتي؟",
    answer:
      "قاعدة الإبهام: لكل 10 أمتار مربعة من المساحة تحتاج تقريباً 1 لتر من الطلاء (طبقة واحدة). لغرفة 16م² (4×4) تحتاج لتدهين الجدران الأربعة حوالي 8–10 لترات (لطبقتين). يُنصح دائماً بإضافة 10–15% احتياطياً للإصلاح والتكرار.",
  },
  {
    question: "ما الفرق بين الدهان الداخلي والخارجي؟",
    answer:
      "الدهان الخارجي مصمم لمقاومة العوامل الجوية (حرارة، رطوبة، أشعة UV) وهو أقوى وأكثر مرونة. الدهان الداخلي مصمم للجماليات ويكون أنعم ملمساً وأسهل في التنظيف. لا يُستخدم أحدهما مكان الآخر.",
  },
  {
    question: "هل يمكنني مطابقة لون معين عندي؟",
    answer:
      "يمكنك وصف اللون أو إرسال صورته لفريق خدمة العملاء عبر واتساب وسنساعدك في إيجاد أقرب لون متاح في مجموعتنا أو اقتراح بديل مناسب.",
  },
];

const SHIPPING_FAQS = [
  {
    question: "هل تشطيب توصل لجميع محافظات مصر؟",
    answer:
      "نعم، نوفر توصيلاً لجميع محافظات مصر الـ 27. تشمل المحافظات التي نخدمها: القاهرة، الجيزة، الإسكندرية، الدقهلية، الشرقية، المنوفية، القليوبية، البحيرة، الغربية، كفر الشيخ، الفيوم، بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان، الإسماعيلية، السويس، بورسعيد، دمياط، شمال سيناء، جنوب سيناء، مطروح، الوادي الجديد، والبحر الأحمر.",
  },
  {
    question: "كم يستغرق التوصيل؟",
    answer:
      "القاهرة الكبرى والإسكندرية: 1–2 يوم عمل. محافظات الدلتا: 2–3 أيام عمل. محافظات الصعيد والحدودية: 3–5 أيام عمل. أوقات التوصيل قد تختلف في المواسم والعطلات الرسمية.",
  },
  {
    question: "كم تكلفة الشحن؟",
    answer:
      "تُحسب تكلفة الشحن تلقائياً عند إتمام الطلب بناءً على محافظتك ووزن المنتجات. نقدم شحناً مجانياً على الطلبات التي تتجاوز حداً معيناً (يُعلن عنه في صفحة المنتجات والعروض).",
  },
  {
    question: "كيف أتابع حالة طلبي؟",
    answer:
      "بمجرد شحن طلبك ستصلك رسالة SMS وبريد إلكتروني يحتوي على رقم تتبع الشحنة. يمكنك أيضاً متابعة حالة طلبك من صفحة 'طلباتي' في حسابك على تشطيب.",
  },
];

const PAYMENT_FAQS = [
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer:
      "نقبل عدة طرق دفع: (1) الدفع عند الاستلام (COD) — ادفع نقداً عند وصول طلبك. (2) بطاقات الائتمان والخصم (فيزا / ماستر كارد). (3) المحافظ الإلكترونية (فودافون كاش، إتصالات كاش، أورانج كاش). (4) InstaPay. جميع المدفوعات الإلكترونية مشفرة وآمنة عبر بوابة Paymob.",
  },
  {
    question: "هل السعر المعروض شامل الضريبة؟",
    answer:
      "الأسعار المعروضة على المنتجات لا تشمل ضريبة القيمة المضافة (14%). تُضاف الضريبة تلقائياً مع تكلفة الشحن في مرحلة مراجعة الطلب قبل تأكيد الدفع.",
  },
  {
    question: "هل يمكنني استخدام كود خصم؟",
    answer:
      "نعم، يمكنك إدخال كود الخصم في صفحة الدفع قبل إتمام الطلب. تابعنا على منصات التواصل الاجتماعي أو اشترك في نشرتنا البريدية للحصول على كودات خصم حصرية.",
  },
  {
    question: "هل الدفع الإلكتروني آمن؟",
    answer:
      "نعم، جميع المعاملات المالية مشفرة بتقنية SSL 256-bit عبر بوابة الدفع الآمنة Paymob المرخصة من البنك المركزي المصري. لا نحتفظ ببيانات بطاقتك الائتمانية على خوادمنا.",
  },
];

const RETURNS_FAQS = [
  {
    question: "ما هي سياسة الإرجاع؟",
    answer:
      "يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام وفق الشروط التالية: (1) المنتج بحالته الأصلية وغير مستخدم. (2) في عبوته الأصلية المغلقة. (3) مع إيصال الشراء. لا يُقبل إرجاع الدهانات المفتوحة أو المخلوطة بألوان مخصصة.",
  },
  {
    question: "كيف أطلب الإرجاع أو الاستبدال؟",
    answer:
      "تواصل مع خدمة العملاء عبر واتساب أو البريد الإلكتروني خلال 14 يوماً من الاستلام. أخبرنا برقم الطلب وسبب الإرجاع، وسيتواصل معك فريقنا خلال 24 ساعة لترتيب الاستلام.",
  },
  {
    question: "متى يتم رد المبلغ بعد الإرجاع؟",
    answer:
      "بعد استلام المنتج والتحقق منه (1–3 أيام عمل)، يُرد المبلغ للطريقة الأصلية للدفع خلال 5–7 أيام عمل. في حالة الدفع نقداً يُرد عبر تحويل بنكي أو محفظة إلكترونية.",
  },
];

const GENERAL_FAQS = [
  {
    question: "هل يتوفر استشارة متخصصة لاختيار الألوان؟",
    answer:
      "نعم، نوفر استشارة مجانية عبر واتساب مع متخصصين في الألوان والديكور. أرسل لنا صور المساحة وأخبرنا بذوقك وميزانيتك وسنقترح عليك التركيبة المثالية.",
  },
  {
    question: "كيف أتواصل مع خدمة العملاء؟",
    answer:
      "يمكنك التواصل معنا عبر: واتساب (الأسرع)، البريد الإلكتروني، أو نموذج التواصل في صفحة 'اتصل بنا'. أوقات العمل: الأحد–الخميس 9ص–10م، الجمعة–السبت 11ص–11م.",
  },
  {
    question: "هل تقدم تشطيب عروضاً وتخفيضات؟",
    answer:
      "نعم، نقدم عروضاً دورية وخصومات خاصة. اشترك في النشرة البريدية للحصول على خصم 10% على أول طلب، وكن أول من يعرف بالعروض الحصرية والمنتجات الجديدة.",
  },
  {
    question: "هل يمكنني الطلب بكميات كبيرة (B2B)؟",
    answer:
      "نعم، نوفر أسعاراً خاصة لطلبات الجملة والمقاولين والشركات. تواصل مع فريق المبيعات لدينا للحصول على عرض سعر مخصص لكميتك.",
  },
];

const ALL_FAQS = [
  ...PRODUCTS_FAQS,
  ...SHIPPING_FAQS,
  ...PAYMENT_FAQS,
  ...RETURNS_FAQS,
  ...GENERAL_FAQS,
];

export default function FaqPage() {
  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const categories = [
    { title: "المنتجات والجودة", icon: "inventory_2", items: PRODUCTS_FAQS },
    { title: "الشحن والتوصيل", icon: "local_shipping", items: SHIPPING_FAQS },
    { title: "الدفع والأسعار", icon: "payments", items: PAYMENT_FAQS },
    { title: "الإرجاع والاستبدال", icon: "assignment_return", items: RETURNS_FAQS },
    { title: "معلومات عامة", icon: "info", items: GENERAL_FAQS },
  ];

  return (
    <main className="min-h-screen bg-gallery-white py-macro-lg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-obsidian transition-colors">الرئيسية</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_left</span>
          <span className="text-obsidian font-medium">الأسئلة الشائعة</span>
        </nav>

        <div className="max-w-3xl">
          {/* Page header */}
          <div className="mb-12">
            <h1 className="text-headline-lg font-headline-lg text-obsidian mb-3">الأسئلة الشائعة</h1>
            <p className="text-body-lg font-body-lg text-secondary">
              كل ما تحتاج معرفته عن تشطيب — من المنتجات والشحن إلى الدفع والإرجاع.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-12">
            {categories.map((cat) => (
              <section key={cat.title}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-tashtep-orange/10 flex items-center justify-center flex-shrink-0">
                    <span
                      className="material-symbols-outlined text-tashtep-orange text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {cat.icon}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-headline-sm font-headline-sm text-obsidian leading-tight">{cat.title}</h2>
                    <p className="text-xs text-secondary mt-0.5">{cat.items.length} أسئلة</p>
                  </div>
                </div>
                <FaqSection items={cat.items} title="" hideSchema />
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-obsidian rounded-2xl text-center">
            <span className="material-symbols-outlined text-tashtep-orange text-[36px] mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
            <h2 className="text-headline-sm font-headline-sm text-gallery-white mb-3">لم تجد إجابة لسؤالك؟</h2>
            <p className="text-gallery-white/70 mb-6 text-body-md">فريقنا جاهز للمساعدة على مدار أيام العمل.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-tashtep-orange text-on-primary px-8 py-3 rounded-lg font-label-md hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              تواصل معنا
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
