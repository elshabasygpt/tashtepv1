import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SettingsService } from "@/services/settings.service";
import { FaqSection } from "@/components/seo/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "تشطيب هي منصة تجارة إلكترونية مصرية متخصصة في بيع الدهانات وخامات التشطيب الفاخرة. تأسست لتكون الوجهة الرقمية الأولى لتشطيب المنازل والمشاريع في مصر. توصيل لجميع المحافظات.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "من نحن | تشطيب - الوجهة الرقمية الأولى للتشطيبات في مصر",
    description:
      "تشطيب: المتجر الإلكتروني المصري المتخصص في دهانات وخامات التشطيب الفاخرة. أشهر الماركات، توصيل سريع، وأسعار تنافسية.",
    type: "website",
  },
};

export const revalidate = 3600;

const ABOUT_FAQS = [
  {
    question: "ما هي تشطيب؟",
    answer:
      "تشطيب (Tashtep) هي منصة تجارة إلكترونية مصرية متخصصة في بيع الدهانات وخامات التشطيب الفاخرة عبر الإنترنت. تأسست لتكون الوجهة الرقمية الأولى لكل من يبحث عن مواد تشطيب المنازل والمشاريع بجودة عالية وأسعار تنافسية في مصر.",
  },
  {
    question: "ما هي المنتجات التي تبيعها تشطيب؟",
    answer:
      "تبيع تشطيب طيفاً واسعاً من منتجات التشطيب يشمل: الدهانات الداخلية والخارجية، ورق الحائط، الأرضيات والسيراميك، مواد العزل، والإكسسوارات المتعلقة بالتشطيب. نحمل ماركات عالمية ومحلية رائدة مثل Jotun وGLC وSCIB وSIPES وNational Paints.",
  },
  {
    question: "هل تشطيب تخدم جميع مناطق مصر؟",
    answer:
      "نعم، تخدم تشطيب جميع محافظات مصر الـ 27 بما فيها القاهرة الكبرى، الإسكندرية، الدلتا، الصعيد، سيناء، والمحافظات الحدودية. يتم حساب تكلفة الشحن وفقاً للمنطقة الجغرافية عند إتمام الطلب.",
  },
  {
    question: "كيف تضمن تشطيب جودة منتجاتها؟",
    answer:
      "تعمل تشطيب مع موزعين معتمدين مباشرة لضمان أصالة جميع المنتجات. كل منتج يأتي بضمان الأصالة، وفي حالة وجود أي خلل أو عدم مطابقة يُقبل الإرجاع خلال 14 يوماً من الاستلام.",
  },
];

export default async function AboutPage() {
  const content = await SettingsService.getAboutPageContent();
  const baseUrl = process.env.APP_URL || "https://tashtep.com";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store"],
    "@id": `${baseUrl}/#organization`,
    name: "تشطيب",
    alternateName: "Tashtep",
    url: baseUrl,
    description:
      "منصة تجارة إلكترونية مصرية متخصصة في بيع الدهانات وخامات التشطيب الفاخرة. توصيل لجميع محافظات مصر.",
    foundingLocation: { "@type": "Country", name: "Egypt" },
    areaServed: { "@type": "Country", name: "Egypt" },
    knowsAbout: ["الدهانات", "التشطيب الداخلي", "ورق الحائط", "الأرضيات", "الديكور المنزلي"],
  };

  return (
    <main className="pt-24 pb-16 bg-gallery-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-obsidian">
        <div className="absolute inset-0 z-0 opacity-60">
          <Image
            src={content.heroImage}
            alt="Tashtep Interior"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent z-0"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-headline-md text-gallery-white mb-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
            {content.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gallery-white/90 font-light font-body-lg animate-in slide-in-from-bottom-10 fade-in duration-700 delay-150 fill-mode-backwards whitespace-pre-wrap">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 min-w-0 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-headline-md text-obsidian">{content.philosophyTitle}</h2>
            <div className="w-16 h-1 bg-tashtep-orange rounded-full"></div>
            <p className="text-lg text-secondary-foreground leading-relaxed whitespace-pre-wrap">
              {content.philosophyText1}
            </p>
            <p className="text-lg text-secondary-foreground leading-relaxed whitespace-pre-wrap">
              {content.philosophyText2}
            </p>
          </div>
          <div className="relative h-[480px] w-full min-w-0 rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2">
            <Image
              src={content.philosophyImage}
              alt="Philosophy"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105 ease-out"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-stone px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-headline-md text-obsidian mb-4">قيمنا وأهدافنا</h2>
            <p className="text-secondary-foreground text-lg">
              نعمل بشغف لتقديم أفضل تجربة لعملائنا مبنية على الثقة والجودة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gallery-white p-10 rounded-3xl shadow-sm border border-soft-border transition-shadow duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-obsidian text-gallery-white rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              </div>
              <h3 className="text-2xl font-headline-md text-obsidian mb-4">{content.visionTitle}</h3>
              <p className="text-secondary-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {content.visionText}
              </p>
            </div>
            <div className="bg-gallery-white p-10 rounded-3xl shadow-sm border border-soft-border transition-shadow duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-tashtep-orange text-gallery-white rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              </div>
              <h3 className="text-2xl font-headline-md text-obsidian mb-4">{content.missionTitle}</h3>
              <p className="text-secondary-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {content.missionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO FAQ — entity facts for AI search engines */}
      <section className="py-16 px-gutter max-w-3xl mx-auto border-t border-stone">
        <FaqSection
          items={ABOUT_FAQS}
          title="أسئلة شائعة عن تشطيب"
        />
      </section>

      {/* CTA */}
      <section className="py-24 px-gutter text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline-md text-obsidian mb-6">
          {content.ctaTitle}
        </h2>
        <p className="text-lg text-secondary-foreground mb-10 whitespace-pre-wrap">
          {content.ctaText}
        </p>
        <Button asChild size="lg" className="bg-obsidian text-gallery-white hover:bg-charcoal h-14 px-10 text-lg rounded-full transition-all duration-300 hover:scale-105">
          <Link href="/products">
            {content.ctaButtonText}
            <span className="material-symbols-outlined mr-2 transition-transform group-hover:-translate-x-2">arrow_back</span>
          </Link>
        </Button>
      </section>
    </main>
  );
}
