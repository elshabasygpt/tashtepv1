"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { Plus, Trash2 } from "lucide-react";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };
type SpecRow = { label: string; value: string };

interface AdminProductFormProps {
  categories: Category[];
  brands: Brand[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    originalPrice: number | null;
    stock: number;
    categoryId: string;
    brandId?: string | null;
    images?: string[];
    oemNumber?: string | null;
    unitLabel?: string | null;
    unitSize?: number | null;
    deliveryDays?: string | null;
    maxOrderQty?: number | null;
    specs?: string | null;
  };
  isEdit?: boolean;
}

function parseSpecs(raw: string | null | undefined): SpecRow[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const UNIT_LABELS = ["لتر", "كيلو", "متر مربع", "متر طولي", "قطعة", "علبة", "كرتون"];

export function AdminProductForm({ categories, brands = [], initialData, isEdit }: AdminProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    originalPrice: initialData?.originalPrice?.toString() || "",
    stock: initialData?.stock?.toString() || "0",
    categoryId: initialData?.categoryId || "",
    brandId: initialData?.brandId || "",
    images: initialData?.images || [],
    oemNumber: initialData?.oemNumber || "",
    unitLabel: initialData?.unitLabel || "",
    unitSize: initialData?.unitSize?.toString() || "",
    deliveryDays: initialData?.deliveryDays || "",
    maxOrderQty: initialData?.maxOrderQty?.toString() || "",
  });

  const [specRows, setSpecRows] = useState<SpecRow[]>(parseSpecs(initialData?.specs));
  const [status, setStatus] = useState<"idle" | "executing">("idle");
  const [result, setResult] = useState<{ success?: boolean; error?: string; serverError?: string; validationErrors?: Record<string, unknown> } | null>(null);

  const addSpecRow = () => setSpecRows((prev) => [...prev, { label: "", value: "" }]);
  const removeSpecRow = (i: number) => setSpecRows((prev) => prev.filter((_, idx) => idx !== i));
  const updateSpecRow = (i: number, field: "label" | "value", val: string) =>
    setSpecRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("executing");

    const validSpecs = specRows.filter((r) => r.label.trim() && r.value.trim());

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock),
      categoryId: formData.categoryId,
      brandId: formData.brandId || null,
      images: formData.images,
      oemNumber: formData.oemNumber || null,
      unitLabel: formData.unitLabel || null,
      unitSize: formData.unitSize ? parseFloat(formData.unitSize) : null,
      deliveryDays: formData.deliveryDays || null,
      maxOrderQty: formData.maxOrderQty ? parseInt(formData.maxOrderQty) : null,
      specs: validSpecs.length > 0 ? JSON.stringify(validSpecs) : null,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateProductAction({ id: initialData.id, data: payload });
    } else {
      res = await createProductAction(payload);
    }

    setResult(res);
    setStatus("idle");

    if (res?.success) {
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

      {/* ── صور المنتج ─────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-4">
        <h3 className="font-bold text-obsidian text-base border-b border-stone pb-2">صور المنتج</h3>
        <MultiImageUpload
          value={formData.images}
          onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
          folder="products"
          label="إضافة صورة للمنتج"
        />
        <p className="text-xs text-secondary">أول صورة هي الصورة الرئيسية للمنتج.</p>
      </div>

      {/* ── المعلومات الأساسية ─────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-4">
        <h3 className="font-bold text-obsidian text-base border-b border-stone pb-2">المعلومات الأساسية</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المنتج *</Label>
            <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">الرابط (Slug) *</Label>
            <Input id="slug" required dir="ltr" className="font-mono" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="categoryId">القسم *</Label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="" disabled>اختر القسم</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="brandId">العلامة التجارية</Label>
            <select
              id="brandId"
              value={formData.brandId}
              onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">بدون علامة تجارية</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">السعر (ج.م) *</Label>
            <Input id="price" type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">السعر قبل الخصم</Label>
            <Input id="originalPrice" type="number" min="0" step="0.01" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">المخزون *</Label>
            <Input id="stock" type="number" required min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">الوصف</Label>
          <Textarea id="description" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>
      </div>

      {/* ── التفاصيل التقنية ───────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-4">
        <h3 className="font-bold text-obsidian text-base border-b border-stone pb-2">التفاصيل التقنية</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unitLabel">وحدة القياس</Label>
            <select
              id="unitLabel"
              value={formData.unitLabel}
              onChange={(e) => setFormData({ ...formData, unitLabel: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">بدون وحدة</option>
              {UNIT_LABELS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unitSize">الكمية في الوحدة</Label>
            <Input
              id="unitSize"
              type="number"
              min="0"
              step="0.01"
              placeholder="مثال: 9 لعبوة 9 لتر"
              value={formData.unitSize}
              onChange={(e) => setFormData({ ...formData, unitSize: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oemNumber">رقم الموديل (OEM)</Label>
            <Input
              id="oemNumber"
              dir="ltr"
              className="font-mono"
              placeholder="مثال: JOT-JP-9L"
              value={formData.oemNumber}
              onChange={(e) => setFormData({ ...formData, oemNumber: e.target.value })}
            />
          </div>
        </div>

        {formData.unitLabel && formData.unitSize && (
          <p className="text-xs text-tashtep-orange bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
            سيظهر للعميل: السعر لكل {formData.unitLabel}: {formData.price ? (parseFloat(formData.price) / parseFloat(formData.unitSize)).toFixed(0) : "—"} ج.م
          </p>
        )}

        {/* جدول المواصفات */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>مواصفات المنتج (جدول)</Label>
            <Button type="button" variant="outline" size="sm" onClick={addSpecRow} className="gap-1 text-xs h-8">
              <Plus className="h-3.5 w-3.5" />
              إضافة مواصفة
            </Button>
          </div>

          {specRows.length === 0 && (
            <p className="text-xs text-secondary bg-stone/50 rounded-lg p-3 text-center">
              لا توجد مواصفات. اضغط &quot;إضافة مواصفة&quot; لإضافة بيانات مثل التغطية، وقت الجفاف، عدد الطبقات...
            </p>
          )}

          {specRows.map((row, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                placeholder="اسم المواصفة (مثال: التغطية)"
                value={row.label}
                onChange={(e) => updateSpecRow(i, "label", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="القيمة (مثال: 10 م²/لتر)"
                value={row.value}
                onChange={(e) => updateSpecRow(i, "value", e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(i)} className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── إعدادات الشراء ─────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-4">
        <h3 className="font-bold text-obsidian text-base border-b border-stone pb-2">إعدادات الشراء</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryDays">أيام التوصيل</Label>
            <Input
              id="deliveryDays"
              dir="ltr"
              placeholder="مثال: 2-3"
              value={formData.deliveryDays}
              onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
            />
            {formData.deliveryDays && (
              <p className="text-xs text-secondary">سيظهر: &quot;يصلك خلال {formData.deliveryDays} أيام عمل&quot;</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxOrderQty">الحد الأقصى للطلب الواحد</Label>
            <Input
              id="maxOrderQty"
              type="number"
              min="1"
              placeholder="99 (الافتراضي)"
              value={formData.maxOrderQty}
              onChange={(e) => setFormData({ ...formData, maxOrderQty: e.target.value })}
            />
            <p className="text-xs text-secondary">الحد الأقصى في محدد الكمية عند الشراء.</p>
          </div>
        </div>
      </div>

      {/* ── رسائل الخطأ ─────────────────────────────────────── */}
      {result?.serverError && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{result.serverError}</div>
      )}
      {result?.validationErrors && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">البيانات المدخلة غير صحيحة.</div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>إلغاء</Button>
        <Button type="submit" disabled={status === "executing"} className="bg-tashtep-orange hover:bg-tashtep-orange/90 text-on-primary px-8">
          {status === "executing" ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
        </Button>
      </div>
    </form>
  );
}
