import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { SettingsService } from "@/services/settings.service";
import { ArticleService } from "@/services/article.service";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { CategoryList } from "@/features/categories/components/category-list";
import { CategoryCard } from "@/features/categories/components/category-card";
import Link from "next/link";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { NewsletterForm } from "@/components/newsletter-form";

export const dynamic = "force-dynamic";

async function FeaturedProducts() {
  const products = await ProductService.getProducts({ limit: 8 });
  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
}

async function FeaturedCategories() {
  const categories = await CategoryService.getCategories();
  return (
    <CategoryList>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={{ ...category, image: category.image || "" }} />
      ))}
    </CategoryList>
  );
}

function SectionLoader() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-tashtep-orange" />
    </div>
  );
}

const DEFAULT_HERO = {
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQAlwS6NiyipnZbqYPVSnGFEh9RnPdQPdBYrlAWXhvBMXgsUFdh7h0YVzgELzcS97x2Dl1ja1_XzLQ_7Jmi3TofYVneNw0CQgs0mTZRZ1U0peh2IQrzATzxtvCoGzucv5MpIzc0eC__o00K4Ynaz_vIjHRWym5nDZJJOW7i0ykCsAYALNqxXgj7Q2WtMHKdkw8YhYFDK1eoKtNOiO0J2vCcLld2EHdGhQ69_sGPRXM3uOAXmv5CvLYDfeaATYXM2q9oDcj9sBZ12J1",
  badge: "التشطيبات الفاخرة",
  title: "حوّل مساحتك إلى لوحة فنية",
  subtitle: "اكتشف أرقى خامات الدهانات والتشطيب الداخلي بأسعار تناسب جميع الميزانيات.",
  ctaText: "تسوق الآن",
  ctaLink: "/products",
  secondaryCtaText: "تعرف علينا",
};

export default async function HomePage() {
  let heroContent = DEFAULT_HERO;
  try {
    heroContent = await SettingsService.getHomePageHero();
  } catch {
    // use default fallback
  }

  // Fetch real articles, fallback to default static articles if none
  let dbArticles: Awaited<ReturnType<typeof ArticleService.getArticles>> = [];
  try {
    dbArticles = await ArticleService.getArticles({ publishedOnly: true, limit: 3 });
  } catch {
    // use static fallback below
  }
  const articles = dbArticles.length > 0 ? dbArticles : [
    {
      id: "1",
      slug: "how-to-choose-paint",
      title: "كيف تختار الدهان المناسب",
      description: "نصائح الخبراء لاختيار نوع الدهان والدرجة اللونية المثالية لكل غرفة في منزلك.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhR2vh7ssvGdOCAU_0e6pw6KdMKhS-5rmangVKdtnB4aZxs8fGkCZAj5N9bBzdGgidqlBPbW8WC0J01N9FLfx7tg2E6coKVbcQuFFrFVf2BCAx7mSu6xkaHaFhE3D_evi11cMU5ZMZXVjmDMUXEpYLgImtEanHWNilD8AAf5xxp_WZCF7GKdC1VRvwdLFOBT1TUDOpGDrk6jHTow56xYKInRn9M_u4ba59J2DijRzyLaWZ_72vC8ViK87qoObsO4E48Ysp8E8sDDit",
    },
    {
      id: "2",
      slug: "colors-2026",
      title: "ألوان 2026",
      description: "اكتشف أحدث صيحات الألوان التي ستشكل ملامح التصميم الداخلي للعام القادم.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF2nZxfxdwiy3fN0moyPOyyg3DQNUPMPguRCQhSA1c1sPUqBBYAvuQPEBnboQb3eNrGKOYVosEVzeMY_Sa5Y-uFb_my3xUwMFWq-TeCbfD1Gtb3I6jWw01GdWNLm-RzCmIDWIiJjrOmuxHnxMDoYC8IZtlzp4Dc-ssD_7B-D3CTfMviQN8o3qM3VBBtYJCPxqxJejjUOXmoNLUOWkL5foUEs807SryL09EBqEJG3cux1hzPkAIK-6mXbUyt2UXKOYK022EsVt7E1Un",
    },
    {
      id: "3",
      slug: "luxury-finishing-guide",
      title: "دليل التشطيبات الفاخرة",
      description: "كل ما تحتاج معرفته عن المواد والخامات لإضفاء لمسة من الرقي والفخامة.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALiWFZFdZvKv2TXjMBP5h-gTyA8pTAZtQxOx5h7xRARsf3xx85ll-pQetwu003LXRWArUuPfJVguzynIojLx6-otgp572dFAhY5uizokTpfFcxXzD-RwA9fd6Z0zxguqhj-rCD1-lNCpVFY6JTW4xG0OzSiA1wEdY1g3U-sdxoaSxvrgGABqf9VT_eTIEz-H5ieNey4DE5wPNICqvwJd0yiwznugzFrCl-IZ9wK1vFzNpB3yikPlDWM154Ph5oAfHsdw82lVU0b811",
    },
  ];
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative w-full h-[870px] min-h-[600px] flex items-center justify-center overflow-hidden bg-stone">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroContent.image || DEFAULT_HERO.image}
            alt={heroContent.badge}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-gutter flex flex-col items-center text-center mt-macro-md">
          <span className="inline-block px-4 py-2 bg-gallery-white/10 backdrop-blur-md rounded-full text-gallery-white text-label-md font-label-md mb-micro-md tracking-wider uppercase border border-gallery-white/20">{heroContent.badge}</span>
          <h1 className="text-display-hero-mobile md:text-display-hero font-display-hero text-gallery-white mb-micro-md max-w-4xl drop-shadow-sm leading-tight tracking-tight">
            {heroContent.title}
          </h1>
          <p className="text-body-lg font-body-lg text-gallery-white/90 max-w-2xl mb-macro-sm font-light">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-micro-md w-full sm:w-auto">
            <Link href={heroContent.ctaLink} className="bg-gallery-white text-obsidian px-10 py-4 rounded text-label-md font-label-md hover:scale-[0.98] transition-all duration-300 ease-out w-full sm:w-auto font-semibold shadow-none text-center flex items-center justify-center">
              {heroContent.ctaText}
            </Link>
            <button className="bg-transparent border border-gallery-white text-gallery-white px-10 py-4 rounded text-label-md font-label-md hover:bg-gallery-white/10 hover:scale-[0.98] transition-all duration-300 ease-out w-full sm:w-auto flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl">play_circle</span>
              {heroContent.secondaryCtaText}
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-stone py-micro-md border-b border-surface-container-high">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-micro-md text-center">
            <div className="flex flex-col items-start justify-start gap-2 p-4 text-start">
              <span className="material-symbols-outlined text-secondary text-2xl">local_shipping</span>
              <span className="text-label-md font-label-md font-light text-charcoal">شحن لجميع المحافظات</span>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 p-4 text-start">
              <span className="material-symbols-outlined text-secondary text-2xl">verified</span>
              <span className="text-label-md font-label-md font-light text-charcoal">منتجات أصلية 100%</span>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 p-4 text-start">
              <span className="material-symbols-outlined text-secondary text-2xl">support_agent</span>
              <span className="text-label-md font-label-md font-light text-charcoal">استشارة مجانية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-macro-lg max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row justify-between items-end mb-macro-sm gap-micro-md">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-2">استكشف حسب احتياجك</h2>
            <p className="text-body-md font-body-md text-secondary">تصنيفات مصممة لتسهيل رحلة تشطيب منزلك.</p>
          </div>
          <Link href="/categories" className="text-label-md font-label-md text-obsidian border-b border-obsidian pb-1 hover:text-secondary hover:border-secondary transition-colors inline-flex items-center gap-1 group">
            عرض جميع التصنيفات
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform rtl:rotate-180">arrow_forward</span>
          </Link>
        </div>
        <Suspense fallback={<SectionLoader />}>
          <FeaturedCategories />
        </Suspense>
      </section>

      {/* Featured Products */}
      <section className="py-macro-lg bg-surface-bright max-w-container-max mx-auto px-gutter border-t border-surface-container-high">
        <div className="flex flex-col md:flex-row justify-between items-end mb-macro-sm gap-micro-md">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-2">أحدث المنتجات</h2>
            <p className="text-body-md font-body-md text-secondary">اكتشف آخر الإضافات لمجموعة منتجاتنا المميزة.</p>
          </div>
          <Link href="/products" className="text-label-md font-label-md text-obsidian border-b border-obsidian pb-1 hover:text-secondary hover:border-secondary transition-colors inline-flex items-center gap-1 group">
            تصفح المزيد
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform rtl:rotate-180">arrow_forward</span>
          </Link>
        </div>
        <Suspense fallback={<SectionLoader />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* Brand Strip */}
      <section className="bg-stone py-macro-md border-y border-surface-container-high overflow-hidden">
        <div className="w-full inline-flex flex-nowrap [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 md:[&_li]:mx-16 [&_img]:max-w-none animate-infinite-scroll">
            {[
              { name: "JOTUN", domain: "jotun.com" },
              { name: "GLC", domain: "glcpaints.com" },
              { name: "SCIB", domain: "scibpaints.com" },
              { name: "SIPES", domain: "sipes.net" },
              { name: "NATIONAL", domain: "nationalpaints.com" },
              { name: "JOTUN", domain: "jotun.com" },
              { name: "GLC", domain: "glcpaints.com" },
              { name: "SCIB", domain: "scibpaints.com" },
              { name: "SIPES", domain: "sipes.net" },
              { name: "NATIONAL", domain: "nationalpaints.com" },
              { name: "JOTUN", domain: "jotun.com" },
              { name: "GLC", domain: "glcpaints.com" },
              { name: "SCIB", domain: "scibpaints.com" },
              { name: "SIPES", domain: "sipes.net" },
              { name: "NATIONAL", domain: "nationalpaints.com" },
            ].map((brand, i) => (
              <li key={i} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105">
                <Image 
                  src={`https://logo.clearbit.com/${brand.domain}`} 
                  alt={brand.name} 
                  className="h-10 md:h-14 w-auto object-contain"
                  width={150}
                  height={56}
                />
                <span className="hidden text-headline-md font-bold tracking-tighter text-obsidian px-4">
                  {brand.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest Offers Banner */}
      <section className="my-macro-md max-w-container-max mx-auto px-gutter">
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-obsidian flex items-center">
          <div className="absolute inset-0 w-full h-full">
            <Image
              alt="Luxury Interior"
              className="object-cover opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQAlwS6NiyipnZbqYPVSnGFEh9RnPdQPdBYrlAWXhvBMXgsUFdh7h0YVzgELzcS97x2Dl1ja1_XzLQ_7Jmi3TofYVneNw0CQgs0mTZRZ1U0peh2IQrzATzxtvCoGzucv5MpIzc0eC__o00K4Ynaz_vIjHRWym5nDZJJOW7i0ykCsAYALNqxXgj7Q2WtMHKdkw8YhYFDK1eoKtNOiO0J2vCcLld2EHdGhQ69_sGPRXM3uOAXmv5CvLYDfeaATYXM2q9oDcj9sBZ12J1"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/50 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full md:w-1/2 p-macro-sm md:p-macro-md text-gallery-white">
            <span className="inline-block px-3 py-1 border border-gallery-white/30 rounded-full text-label-md font-label-md mb-4 uppercase tracking-wider">أحدث العروض</span>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-4 leading-tight">جدد مساحتك بأسعار استثنائية</h2>
            <p className="text-body-lg font-body-lg text-gallery-white/80 mb-8 max-w-md">خصومات حصرية تصل إلى ٣٠٪ على تشكيلة مختارة من أرقى الدهانات والتشطيبات الفاخرة.</p>
            <Link href="/products" className="bg-gallery-white text-obsidian px-8 py-3 rounded text-label-md font-label-md hover:bg-surface-bright transition-colors duration-200 font-semibold shadow-md inline-flex items-center gap-2">
              تسوق العروض الآن
              <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Center */}
      <section className="py-macro-lg max-w-container-max mx-auto px-gutter bg-surface-bright">
        <div className="flex justify-between items-end mb-macro-sm">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-2">مركز المعرفة</h2>
            <p className="text-body-md font-body-md text-secondary">دليلك الشامل لإلهام وإتقان تصميم منزلك.</p>
          </div>
          <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-label-md font-label-md text-obsidian border-b border-obsidian pb-0.5 hover:text-tashtep-orange hover:border-tashtep-orange transition-colors">
            تصفح كل المقالات
            <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {articles.map((article: { id: string; title: string; slug: string; description: string | null; image: string | null; }) => (
            <Link key={article.title} href={`/blog/${article.slug}`} className="group block">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-stone">
                {article.image ? (
                  <Image alt={article.title} className="object-cover transition-transform duration-500 group-hover:scale-105" src={article.image} fill />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary opacity-50">
                    <span className="material-symbols-outlined text-4xl">image</span>
                  </div>
                )}
              </div>
              <h3 className="text-headline-md text-[24px] text-obsidian mb-2 group-hover:text-tashtep-orange transition-colors">{article.title}</h3>
              <p className="text-body-md font-body-md text-secondary mb-4 line-clamp-2">{article.description}</p>
              <span className="text-label-md font-label-md text-obsidian border-b border-obsidian pb-0.5 inline-flex items-center gap-1 group-hover:text-tashtep-orange group-hover:border-tashtep-orange transition-colors">
                اقرأ المزيد
                <span className="material-symbols-outlined text-[14px] rtl:rotate-180 transition-transform group-hover:-translate-x-1">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/blog" className="inline-flex items-center gap-2 text-label-md font-label-md text-obsidian border-b border-obsidian pb-0.5 hover:text-tashtep-orange hover:border-tashtep-orange transition-colors">
            تصفح كل المقالات
            <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-macro-lg bg-gradient-to-b from-obsidian via-obsidian to-[#1a1208] relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-tashtep-orange/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-container-max mx-auto px-gutter text-center relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="material-symbols-outlined text-tashtep-orange text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            <span className="inline-block px-4 py-1.5 bg-tashtep-orange/20 text-tashtep-orange rounded-full text-label-md font-label-md tracking-wider">
              عروض حصرية للمشتركين
            </span>
          </div>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-gallery-white mb-3">
            كن أول من يعرف بالعروض الجديدة
          </h2>
          <p className="text-body-md font-body-md text-gallery-white/70 mb-8 max-w-md mx-auto">
            اشترك الآن واحصل على خصم 10% على أول طلب لك، وكن أول من يعرف بأحدث المنتجات والعروض الحصرية.
          </p>
          <div className="max-w-lg mx-auto">
            <NewsletterForm />
          </div>
          <p className="text-xs text-white/40 mt-4">لن نرسل لك بريداً مزعجاً. يمكنك إلغاء الاشتراك في أي وقت.</p>
        </div>
      </section>

      {/* About Us */}
      <section className="py-macro-lg max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-macro-md items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-headline-lg font-headline-lg text-obsidian mb-6 tracking-tight">الوجهة الرقمية الأولى للفخامة</h2>
            <p className="text-body-lg font-body-lg text-secondary leading-relaxed font-light mb-8">
              نحن في تشطيب نؤمن بأن كل مساحة تروي قصة. بوصفنا صالة العرض الرقمية الرائدة للتشطيبات الفاخرة، نجمع بين أرقى الخامات وأحدث التصاميم لنوفر لك تجربة تسوق استثنائية. من اختيار الدرجة اللونية المثالية إلى التفاصيل الدقيقة للأرضيات، نحن هنا لنلهم إبداعك ونساعدك في تحويل رؤيتك إلى واقع ملموس يعكس ذوقك الرفيع.
            </p>
            <Link href="/about" className="text-label-md font-label-md text-obsidian uppercase tracking-widest border-b border-obsidian pb-1 hover:text-tashtep-orange hover:border-tashtep-orange transition-colors inline-block">
              اكتشف فلسفتنا
            </Link>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Editorial Interior"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIx8wbIARQWo9NQaLjJ0OJ2xZJoM6XcmPdkt32W8OsLbKu14SOAuqb5AFi3n4E7aSeQlV3CN2kxCcLvptqWQL2qQUrgMLHwBdLfh6LgK1eJlgGnqJaT-5BvyP6slGJTJMbWXkzH8LUIyM0DbnWy_Ceb8QKQRfnIYvUolV_1F0pflEoqYbEsGuVnUtIHaolZgR5-uId6e3tk6dPTnUMHopy1d6ywVvbL5_bgBSSAJ0dxXhqq3Q0PshAh-hw-wYH0s8GdHhhu9SbFrNP"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
