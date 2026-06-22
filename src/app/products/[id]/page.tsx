import { ProductService } from "@/services/product.service";
import { Container } from "@/components/layout/container";

export const dynamic = "force-dynamic";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { ProductActions } from "@/features/products/components/product-actions";
import { ProductReviews } from "@/features/products/components/product-reviews";
import { ReviewService } from "@/services/review.service";
import { getCurrentUser } from "@/lib/auth";

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

  return (
    <Section className="py-12 bg-white min-h-screen">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
             {product.image ? (
               <Image src={product.image} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt={product.name} />
             ) : (
               <span className="text-muted-foreground font-medium text-lg z-10">صورة المنتج</span>
             )}
          </div>

          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-4">{product.category}</Badge>
            <h1 className="text-4xl font-black text-obsidian mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-tashtep-orange">
                <Star className="h-5 w-5 fill-current" />
                <span className="mr-1 font-bold">{product.rating}</span>
              </div>
              <span className="text-charcoal">({product.reviewsCount} تقييم)</span>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-black text-obsidian">{product.price} ج.م</span>
              {product.originalPrice && (
                <span className="text-xl text-charcoal line-through mr-4">{product.originalPrice} ج.م</span>
              )}
            </div>

            <p className="text-charcoal text-lg mb-8 leading-relaxed">
              {product.description || "تفاصيل المنتج ومواصفاته الفنية غير متوفرة حالياً. نوفر أفضل خامات التشطيب لضمان الجودة والمتانة الفائقة لعملائنا في كافة أنحاء الجمهورية."}
            </p>

            <ProductActions productId={product.id} />
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
