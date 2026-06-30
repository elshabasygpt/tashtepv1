"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrandAction, updateBrandAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrandData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
}

export function BrandForm({ brand }: { brand?: BrandData }) {
  const router = useRouter();
  const [name, setName]         = useState(brand?.name ?? "");
  const [slug, setSlug]         = useState(brand?.slug ?? "");
  const [description, setDesc]  = useState(brand?.description ?? "");
  const [logo, setLogo]         = useState(brand?.logo ?? "");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  function autoSlug(val: string) {
    return val.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = { name, slug, description: description || undefined, logo: logo || null };

    const res = brand
      ? await updateBrandAction({ id: brand.id, data })
      : await createBrandAction(data);

    if (res?.data?.success) {
      router.push("/admin/brands");
      router.refresh();
    } else {
      setError(res?.error ?? res?.data?.message ?? "حدث خطأ غير متوقع");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone rounded-2xl p-6 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">اسم الماركة <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!brand) setSlug(autoSlug(e.target.value));
          }}
          placeholder="مثال: فيلبس"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">الرابط (slug) <span className="text-red-500">*</span></Label>
        <Input
          id="slug"
          dir="ltr"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="philips"
          required
          className="font-mono"
        />
        <p className="text-xs text-secondary">أحرف إنجليزية صغيرة وأرقام وشرطات فقط</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">الوصف <span className="text-secondary text-xs">(اختياري)</span></Label>
        <Input id="description" value={description} onChange={(e) => setDesc(e.target.value)} placeholder="وصف قصير للماركة" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="logo">رابط الشعار <span className="text-secondary text-xs">(اختياري)</span></Label>
        <Input id="logo" dir="ltr" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="/uploads/brand-logo.png" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo && <img src={logo} alt="logo preview" className="mt-2 h-12 object-contain border border-stone rounded-lg p-1" />}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="tashtep" disabled={loading} className="flex-1">
          {loading ? "جاري الحفظ..." : brand ? "حفظ التغييرات" : "إضافة الماركة"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
