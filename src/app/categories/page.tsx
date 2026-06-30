import { CategoryService } from "@/services/category.service";
import { Container } from "@/components/layout/container";

import { Section } from "@/components/layout/section";
import { CategoryList } from "@/features/categories/components/category-list";
import { CategoryCard } from "@/features/categories/components/category-card";

export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "التصنيفات",
  description: "تصفح جميع أقسام الدهانات وخامات التشطيب والديكور الداخلي في تشطيب.",
  alternates: { canonical: "/categories" },
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
    <Section className="min-h-screen bg-white py-macro-md md:py-macro-lg">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-secondary mb-6" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-obsidian transition-colors">الرئيسية</Link>
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="text-obsidian font-medium">الأقسام</span>
        </nav>

        <div className="mb-macro-sm">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-2">الأقسام</h1>
          <p className="text-body-lg text-secondary">تصفح جميع أقسام الدهانات وخامات التشطيب المتوفرة لدينا.</p>
        </div>
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-tashtep-orange" /></div>}>
          <AllCategories />
        </Suspense>
      </Container>
    </Section>
  );
}
