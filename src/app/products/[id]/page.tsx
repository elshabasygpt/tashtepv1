import { ProductService } from "@/services/product.service";
import { Container } from "@/components/layout/container";

export const dynamic = "force-dynamic";
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

const TRUST_ROW = [
  { icon: "local_shipping", label: "شحن لجميع المحافظات" },
  { icon: "verified", label: "أصلي 100%" },
  { icon: "support_agent", label: "دعم فني مجاني" },
];

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const product = await ProductService.getProductById(resolvedParams.id);
    return {
      title: product?.name || "منتج غير موجود",
    };
  } catch {
    return { title: "منتج غير موجود" };
  }
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  let product;
  let reviews = [];
  try {
    product = await ProductService.getProductById(resolvedParams.id);
    reviews = await ReviewService.getProductReviews(resolvedParams.id);
  } catch {
    notFound();
  }

  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  if (!product) notFound();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
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

            <p className="text-body-md md:text-body-lg font-body-md text-secondary mb-8 leading-relaxed max-w-[480px]">
              {product.description || "تفاصيل المنتج ومواصفاته الفنية غير متوفرة حالياً. نوفر أفضل خامات التشطيب لضمان الجودة والمتانة الفائقة لعملائنا في كافة أنحاء الجمهورية."}
            </p>

            <div className="flex flex-col gap-6 p-6 border border-stone rounded-lg bg-surface-bright mb-8">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="font-headline-lg text-[40px] text-obsidian leading-none tracking-tight">{product.price} ج.م</span>
                {product.originalPrice && (
                  <span className="font-body-md text-[16px] text-secondary line-through pb-1">{product.originalPrice} ج.م</span>
                )}
              </div>
              <ProductPurchasePanel
                productId={product.id}
                productName={product.name}
                price={product.price}
                variants={product.variants}
              />
            </div>

            <div className="pt-6 border-t border-stone flex flex-wrap gap-x-6 gap-y-4 justify-between items-center text-secondary">
              {TRUST_ROW.map((item) => (
                <div key={item.icon} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-label-md text-[13px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductReviews
          productId={product.id}
          reviews={reviews}
          isAuthenticated={isAuthenticated}
        />
      </Container>
    </Section>
  );
}
