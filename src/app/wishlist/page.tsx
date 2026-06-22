import { WishlistService } from "@/services/wishlist.service";
import { ProductService, PrismaProductWithRelations } from "@/services/product.service";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "المفضلة",
};

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/wishlist");
  }

  const wishlist = (await WishlistService.getUserWishlist(user.id)) as { items: unknown[] };
  const items = wishlist?.items || [];
  type WishlistItemResponse = { product: PrismaProductWithRelations };
  const wishlistItemsData = items as WishlistItemResponse[];
  
  const products = wishlistItemsData.map((item) => ProductService.mapToUIProduct(item.product));

  return (
    <Section className="py-12 bg-white min-h-screen">
      <Container>
        <h1 className="text-4xl font-bold text-obsidian mb-8">المفضلة</h1>
        
        {products.length > 0 ? (
          <ProductGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        ) : (
          <EmptyState 
            title="المفضلة فارغة" 
            description="لم تقم بحفظ أي منتجات في مفضلتك حتى الآن. استكشف منتجاتنا وأضف ما يعجبك لتجده هنا لاحقاً." 
          />
        )}
      </Container>
    </Section>
  );
}
