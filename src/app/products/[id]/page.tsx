import { cache } from "react";
import { ProductService } from "@/services/product.service";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductPurchasePanel } from "@/features/products/components/product-purchase-panel";
import { ProductReviews } from "@/features/products/components/product-reviews";
import { ReviewService } from "@/services/review.service";
import { getCurrentUser } from "@/lib/auth";
import { ProductCard } from "@/features/products/components/product-card";
import { FaqSection } from "@/components/seo/faq-section";
import { TrackRecentlyViewed, RecentlyViewedSection } from "@/components/recently-viewed";
import { FlashSaleCountdown } from "@/components/flash-sale-countdown";
import { B2BPriceBadge } from "@/components/b2b-price-badge";
import { CompareButton } from "@/features/products/components/compare-button";

export const dynamic = "force-dynamic";

// Deduplicate DB query across generateMetadata + page within the same request
const getProduct = cache((id: string) => ProductService.getProductById(id));

function SpecsTable({ specs, oemNumber }: { specs?: string | null; oemNumber?: string | null }) {
  let rows: { label: string; value: string }[] = [];
  try { rows = JSON.parse(specs || "[]"); } catch { rows = []; }
  if (oemNumber) rows = [{ label: "رقم الموديل", value: oemNumber }, ...rows];
  if (rows.length === 0) return null;
  return (
    <div className="mt-10 border border-stone rounded-xl overflow-hidden">
      <div className="bg-stone px-4 py-3 border-b border-stone">
        <h3 className="font-bold text-obsidian text-sm">مواصفات المنتج</h3>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-stone/30"}>
              <td className="px-4 py-2.5 font-medium text-obsidian w-2/5 border-b border-stone last:border-0">{row.label}</td>
              <td className="px-4 py-2.5 text-secondary border-b border-stone last:border-0">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const product = await getProduct(resolvedParams.id);
    if (!product) return { title: "منتج غير موجود" };

    const description = `اشتري ${product.name} بسعر ${product.price} جنيه من تشطيب مصر. توصيل سريع لجميع المحافظات.${product.brand ? ` ماركة ${product.brand.name}.` : ""} أصلي 100% مع ضمان الجودة.`;
    const ogImage = (product.images?.[0] ?? product.image) as string | undefined;

    return {
      title: `${product.name} | سعر ومواصفات`,
      description,
      keywords: [product.name, product.category, "سعر", "شراء اونلاين", "مصر", "تشطيب", "دهانات"],
      alternates: { canonical: `/products/${product.id}` },
      openGraph: {
        title: `${product.name} | تشطيب`,
        description,
        images: ogImage
          ? [{ url: ogImage, width: 800, height: 800, alt: product.name }]
          : undefined,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | تشطيب`,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return { title: "منتج غير موجود" };
  }
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  const [productResult, reviewsResult] = await Promise.allSettled([
    getProduct(resolvedParams.id),
    ReviewService.getProductReviews(resolvedParams.id),
  ]);

  if (productResult.status === "rejected") notFound();
  const product = productResult.status === "fulfilled" ? productResult.value : undefined;
  if (!product) notFound();

  const reviews = reviewsResult.status === "fulfilled" ? reviewsResult.value : [];

  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  const isOnSale =
    product.salePrice != null &&
    (product.saleEndAt == null || new Date(product.saleEndAt) > new Date());
  const effectivePrice = isOnSale ? (product.salePrice as number) : product.price;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const baseUrl = process.env.APP_URL || "https://tashtep.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [product.image],
    description: product.description || `اشتري ${product.name} بأفضل سعر من تشطيب.`,
    sku: product.id,
    url: `${baseUrl}/products/${product.id}`,
    brand: {
      "@type": "Brand",
      name: product.brand?.name ?? "تشطيب",
    },
    seller: {
      "@type": "Organization",
      name: "تشطيب",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EGP",
      price: product.price,
      availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${baseUrl}/products/${product.id}`,
      seller: { "@type": "Organization", name: "تشطيب" },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".product-description"],
    },
    ...(reviews.length > 0 && {
      review: reviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
        author: { "@type": "Person", name: r.user?.name ?? "عميل تشطيب" },
        ...(r.comment && { reviewBody: r.comment }),
      })),
    }),
    ...(product.reviewsCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: baseUrl },
      { "@type": "ListItem", position: 2, name: product.category, item: `${baseUrl}/products?category=${encodeURIComponent(product.category)}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${baseUrl}/products/${product.id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <TrackRecentlyViewed current={{ id: product.id, name: product.name, price: product.price, image: product.images?.[0] ?? product.image ?? undefined }} />
      <Section className="py-macro-md md:py-macro-lg bg-white min-h-screen">
      <Container className="max-w-container-max">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-macro-sm flex items-center text-secondary gap-2 flex-wrap">
          <Link href="/" className="font-label-md text-label-md hover:text-obsidian transition-colors">الرئيسية</Link>
          <span className="material-symbols-outlined text-[16px] rtl:rotate-180">chevron_left</span>
          <Link href="/products" className="font-label-md text-label-md hover:text-obsidian transition-colors">{product.category}</Link>
          <span className="material-symbols-outlined text-[16px] rtl:rotate-180">chevron_left</span>
          <span aria-current="page" className="font-label-md text-label-md text-obsidian">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : []}
              name={product.name}
              badges={
                <>
                  {product.isNew && (
                    <span className="bg-obsidian text-on-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">جديد</span>
                  )}
                  {discount > 0 && (
                    <span className="bg-error text-on-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">خصم {discount}%</span>
                  )}
                </>
              }
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-0">
            <p className="font-body-md text-[13px] text-tertiary-container uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center text-tashtep-orange">
                <Star className="h-4 w-4 fill-current" />
                <span className="mr-1 font-label-md text-label-md text-obsidian">{product.rating}</span>
              </div>
              <span className="font-label-md text-label-md text-secondary">({product.reviewsCount} تقييم)</span>
            </div>

            <p className="product-description text-body-md md:text-body-lg font-body-md text-secondary mb-8 leading-relaxed max-w-[480px]">
              {product.description || "تفاصيل المنتج ومواصفاته الفنية غير متوفرة حالياً. نوفر أفضل خامات التشطيب لضمان الجودة والمتانة الفائقة لعملائنا في كافة أنحاء الجمهورية."}
            </p>

            {product.salePrice != null && product.saleEndAt && new Date(product.saleEndAt) > new Date() && (
              <FlashSaleCountdown
                saleEndAt={product.saleEndAt}
                salePrice={product.salePrice}
                originalPrice={product.price}
              />
            )}
            <B2BPriceBadge productId={product.id} />
            <div className="flex flex-col gap-6 p-6 border border-stone rounded-lg bg-surface-bright mb-8">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="font-headline-lg text-[40px] text-obsidian leading-none tracking-tight">{effectivePrice} ج.م</span>
                {isOnSale ? (
                  <span className="font-body-md text-[16px] text-secondary line-through pb-1">{product.price} ج.م</span>
                ) : product.originalPrice ? (
                  <span className="font-body-md text-[16px] text-secondary line-through pb-1">{product.originalPrice} ج.م</span>
                ) : null}
              </div>
              <ProductPurchasePanel
                productId={product.id}
                productName={product.name}
                price={effectivePrice}
                image={product.images?.[0] ?? product.image ?? ""}
                stock={product.stock}
                variants={product.variants}
                crossSells={product.crossSells}
                unitLabel={product.unitLabel}
                unitSize={product.unitSize}
                deliveryDays={product.deliveryDays}
                maxOrderQty={product.maxOrderQty}
              />
              <CompareButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0] ?? product.image ?? "",
                  category: product.category,
                }}
                className="w-full mt-2"
              />
            </div>

          </div>
        </div>

        <SpecsTable specs={product.specs} oemNumber={product.oemNumber} />

        <ProductReviews
          productId={product.id}
          reviews={reviews}
          isAuthenticated={isAuthenticated}
        />

        {product.crossSells && product.crossSells.length > 0 && (
          <div className="mt-16 border-t border-stone pt-12">
            <h2 className="text-headline-sm font-headline-sm text-obsidian mb-8">منتجات مكملة قد تهمك</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {product.crossSells.map((crossSellProduct) => (
                <ProductCard key={crossSellProduct.id} product={crossSellProduct} />
              ))}
            </div>
          </div>
        )}

        <RecentlyViewedSection />
        <FaqSection
          items={[
            {
              question: `هل يتوفر توصيل ${product.name} لكل محافظات مصر؟`,
              answer: "نعم، نوفر شحن وتوصيل لجميع محافظات مصر، وتختلف تكلفة الشحن حسب المحافظة وتُحسب تلقائياً عند إتمام الطلب.",
            },
            {
              question: "ما هي طرق الدفع المتاحة؟",
              answer: "يمكنك الدفع عند الاستلام (COD) أو الدفع الإلكتروني عبر البطاقات والمحافظ الرقمية من خلال بوابة الدفع الآمنة.",
            },
            {
              question: "هل السعر المعروض شامل الضريبة؟",
              answer: "السعر المعروض للمنتج لا يشمل ضريبة القيمة المضافة (14%)، والتي تُضاف تلقائياً مع تكلفة الشحن عند مراجعة الطلب في صفحة الدفع.",
            },
            {
              question: "ما هي سياسة الإرجاع؟",
              answer: "يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام إذا كان بحالته الأصلية وغير مستخدم.",
            },
          ]}
        />
      </Container>
    </Section>
    </>
  );
}
