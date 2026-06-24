import { CategoryService } from "@/services/category.service";
import { Container } from "@/components/layout/container";

import { Section } from "@/components/layout/section";
import { CategoryList } from "@/features/categories/components/category-list";
import { CategoryCard } from "@/features/categories/components/category-card";

export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "التصنيفات",
};

async function AllCategories() {
  const categories = await CategoryService.getCategories();
  // Show only main categories at the root categories page
  const mainCategories = categories.filter(c => c.parentId === null);

  return (
    <CategoryList>
      {mainCategories.map((category) => (
        <CategoryCard key={category.id} category={{ ...category, image: category.image || "" }} />
      ))}
    </CategoryList>
  );
}

export default function CategoriesPage() {
  return (
    <Section className="min-h-screen bg-gallery py-12">
      <Container>
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-obsidian">التصنيفات</h1>
          <p className="text-lg text-charcoal">تصفح جميع أقسام المنتجات المتوفرة لدينا.</p>
        </div>
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-tashtep-orange" /></div>}>
          <AllCategories />
        </Suspense>
      </Container>
    </Section>
  );
}
