import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SettingsService } from "@/services/settings.service";

export const metadata = {
  title: "من نحن",
  description: "اكتشف قصة تشطيب وفلسفتنا في عالم الديكور والتشطيبات الفاخرة.",
};

export const revalidate = 0; // Ensure fresh data when updated, or we can use on-demand revalidation.

export default async function AboutPage() {
  const content = await SettingsService.getAboutPageContent();

  return (
    <main className="pt-24 pb-16 bg-gallery-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-headline-md text-obsidian">{content.philosophyTitle}</h2>
            <div className="w-16 h-1 bg-tashtep-orange rounded-full"></div>
            <p className="text-lg text-secondary-foreground leading-relaxed whitespace-pre-wrap">
              {content.philosophyText1}
            </p>
            <p className="text-lg text-secondary-foreground leading-relaxed whitespace-pre-wrap">
              {content.philosophyText2}
            </p>
          </div>
          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={content.philosophyImage}
              alt="Philosophy"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-110 ease-out"
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
            <div className="bg-gallery-white p-12 rounded-3xl shadow-sm border border-soft-border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-obsidian text-gallery-white rounded-2xl flex items-center justify-center mb-8 transform transition-transform group-hover:rotate-12">
                <span className="material-symbols-outlined text-3xl">visibility</span>
              </div>
              <h3 className="text-2xl font-headline-md text-obsidian mb-4">{content.visionTitle}</h3>
              <p className="text-secondary-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {content.visionText}
              </p>
            </div>
            <div className="bg-gallery-white p-12 rounded-3xl shadow-sm border border-soft-border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-tashtep-orange text-gallery-white rounded-2xl flex items-center justify-center mb-8 transform transition-transform group-hover:rotate-12">
                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-2xl font-headline-md text-obsidian mb-4">{content.missionTitle}</h3>
              <p className="text-secondary-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {content.missionText}
              </p>
            </div>
          </div>
        </div>
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
