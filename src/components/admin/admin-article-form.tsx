"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createArticleAction, updateArticleAction } from "@/actions/article.actions";
import { ImageUpload } from "@/components/admin/image-upload";

interface ArticleFormData {
  title: string;
  slug: string;
  description?: string;
  content: string;
  image?: string;
  published: boolean;
}

interface AdminArticleFormProps {
  initialData?: ArticleFormData & { id: string };
}

export function AdminArticleForm({ initialData }: AdminArticleFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, setValue } = useForm<ArticleFormData>({
    defaultValues: initialData || { published: true },
  });

  const onSubmit = async (data: ArticleFormData) => {
    setIsPending(true);
    try {
      const result = initialData
        ? await updateArticleAction(initialData.id, data)
        : await createArticleAction(data);

      if (result.success) {
        toast.success(initialData ? "تم تعديل المقال بنجاح" : "تم إنشاء المقال بنجاح");
        router.push("/admin/articles");
      } else {
        toast.error(result.error || "حدث خطأ أثناء الحفظ");
      }
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">عنوان المقال *</label>
            <Input {...register("title", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">رابط المقال (Slug) *</label>
            <Input {...register("slug", { required: true })} className="bg-stone" dir="ltr" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-obsidian">وصف قصير</label>
          <Textarea {...register("description")} className="bg-stone min-h-[80px]" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-obsidian">محتوى المقال *</label>
          <Textarea {...register("content", { required: true })} className="bg-stone min-h-[400px] font-mono text-sm" dir="rtl" />
          <div className="text-xs text-secondary bg-stone/60 rounded-lg p-3 space-y-1 border border-stone">
            <p className="font-bold text-obsidian mb-1">تنسيق Markdown مدعوم:</p>
            <p><code className="bg-white px-1 rounded">## عنوان رئيسي</code> — H2</p>
            <p><code className="bg-white px-1 rounded">### عنوان فرعي</code> — H3</p>
            <p><code className="bg-white px-1 rounded">- عنصر قائمة</code> — نقطة</p>
            <p><code className="bg-white px-1 rounded">**نص غامق**</code> — Bold</p>
            <p>سطر فارغ = فاصل بين الفقرات</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-obsidian">صورة المقال</label>
          <ImageUpload
            value={watch("image") || ""}
            onChange={(url) => setValue("image", url, { shouldDirty: true })}
            folder="articles"
            label="اختر صورة للمقال"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" id="published" {...register("published")} className="w-5 h-5 accent-tashtep-orange rounded" />
          <label htmlFor="published" className="text-sm font-bold text-obsidian cursor-pointer">
            نشر المقال (متاح للزوار)
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.push("/admin/articles")}
          disabled={isPending}
          className="px-8"
        >
          إلغاء
        </Button>
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-tashtep-orange text-white hover:bg-tashtep-orange/90 px-8"
        >
          {isPending ? "جاري الحفظ..." : "حفظ المقال"}
        </Button>
      </div>
    </form>
  );
}
