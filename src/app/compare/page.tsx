"use client";

import { useEffect, useState, useTransition } from "react";
import { useCompare } from "@/hooks/use-compare";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import Image from "next/image";
import { addToCartAction } from "@/actions/cart.actions";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { useSession } from "next-auth/react";
import { useCart, guestCartItemId } from "@/hooks/useCart";
import { toast } from "sonner";
import { ShoppingCart, Loader2, Heart, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ProductDetail = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  rating: number;
  reviewsCount: number;
  description?: string | null;
  category: string;
  brand?: string | null;
  image: string;
  colors?: string[];
  sizes?: string[];
};

type RowDef = {
  key: keyof ProductDetail;
  label: string;
  render?: (v: unknown, allValues: unknown[]) => React.ReactNode;
  highlight?: "min" | "max";
};

function StarBadge({ v }: { v: number }) {
  return (
    <span className="flex items-center justify-center gap-1">
      <span
        className="material-symbols-outlined text-amber-400 text-[14px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
      <span>{v.toFixed(1)} / 5</span>
    </span>
  );
}

function ColorSwatches({ colors }: { colors: string[] }) {
  if (!colors.length) return <span className="text-stone-400">—</span>;
  return (
    <div className="flex gap-1 justify-center flex-wrap">
      {colors.slice(0, 8).map((c, i) => (
        <span
          key={i}
          className="w-5 h-5 rounded-full border border-stone-200 shadow-sm inline-block"
          style={{ backgroundColor: c }}
        />
      ))}
      {colors.length > 8 && (
        <span className="text-xs text-secondary self-center">+{colors.length - 8}</span>
      )}
    </div>
  );
}

const ROWS: RowDef[] = [
  { key: "category", label: "القسم" },
  { key: "brand", label: "الماركة", render: (v) => (v as string) || "—" },
  {
    key: "price",
    label: "السعر",
    highlight: "min",
    render: (v) => (
      <span className="text-lg font-black tabular-nums">
        {new Intl.NumberFormat("ar-EG").format(v as number)} ج.م
      </span>
    ),
  },
  {
    key: "originalPrice",
    label: "السعر قبل الخصم",
    render: (v) =>
      v ? (
        <span className="line-through text-secondary tabular-nums">
          {new Intl.NumberFormat("ar-EG").format(v as number)} ج.م
        </span>
      ) : (
        "—"
      ),
  },
  {
    key: "stock",
    label: "المخزون",
    highlight: "max",
    render: (v) => {
      const n = Number(v);
      if (n === 0) return <span className="text-red-500 font-medium">نفذ المخزون</span>;
      if (n <= 5) return <span className="text-amber-600 font-medium">{n} قطعة فقط</span>;
      return `${n} قطعة`;
    },
  },
  {
    key: "rating",
    label: "التقييم",
    highlight: "max",
    render: (v) => <StarBadge v={v as number} />,
  },
  {
    key: "reviewsCount",
    label: "عدد التقييمات",
    highlight: "max",
    render: (v) => `${v} تقييم`,
  },
  {
    key: "colors",
    label: "الألوان المتاحة",
    render: (v) => <ColorSwatches colors={(v as string[]) ?? []} />,
  },
  {
    key: "sizes",
    label: "الأحجام المتاحة",
    render: (v) => {
      const sizes = (v as string[]) ?? [];
      return sizes.length ? sizes.join("، ") : "—";
    },
  },
  {
    key: "description",
    label: "الوصف",
    render: (v) => (
      <span className="text-xs text-right leading-relaxed line-clamp-4 block">
        {(v as string) || "—"}
      </span>
    ),
  },
];

function AddToCartBtn({ product }: { product: ProductDetail }) {
  const { status } = useSession();
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const needsVariant = (product.colors?.length ?? 0) > 0 || (product.sizes?.length ?? 0) > 0;

  function handle() {
    if (product.stock === 0) return;

    if (needsVariant) {
      toast.info("اختر المواصفات أولاً من صفحة المنتج", { duration: 2000 });
      router.push(`/products/${product.id}`);
      return;
    }

    if (status !== "authenticated") {
      addItem({
        id: guestCartItemId(product.id),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      toast.success("أُضيف للسلة");
      return;
    }
    startTransition(async () => {
      const res = await addToCartAction({ productId: product.id, quantity: 1 });
      if (res?.success) toast.success("أُضيف للسلة");
      else toast.error("حدث خطأ");
    });
  }

  return (
    <button
      onClick={handle}
      disabled={isPending || product.stock === 0}
      className="w-full flex items-center justify-center gap-2 bg-tashtep-orange text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : needsVariant ? (
        <ExternalLink className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {product.stock === 0 ? "نفذ المخزون" : needsVariant ? "اختر المواصفات" : "أضف للسلة"}
    </button>
  );
}

function WishlistBtn({ product }: { product: ProductDetail }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wished = isWishlisted(product.id);
  const [, startTransitionWishlist] = useTransition();
  const router = useRouter();

  function handle() {
    const currentlyWished = isWishlisted(product.id); // read live state, not stale closure
    toggleWishlist(product.id); // optimistic
    toast[currentlyWished ? "info" : "success"](currentlyWished ? "أُزيل من المفضلة" : "أُضيف للمفضلة", {
      duration: 1500,
    });
    startTransitionWishlist(async () => {
      const result = await toggleWishlistAction({ productId: product.id });
      if (!result?.success) {
        toggleWishlist(product.id); // revert
        if (result?.unauthorized) router.push("/login");
      }
    });
  }

  return (
    <button
      onClick={handle}
      className={cn(
        "w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border transition-colors",
        wished
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "border-stone/60 text-obsidian hover:border-obsidian"
      )}
    >
      <Heart className={cn("w-4 h-4", wished && "fill-red-500")} />
      {wished ? "في المفضلة" : "أضف للمفضلة"}
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone/60 shadow-sm bg-white animate-pulse">
      <div className="p-6 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="w-28 h-28 bg-stone/20 rounded-xl mx-auto" />
            <div className="h-4 bg-stone/20 rounded w-3/4 mx-auto" />
            <div className="h-3 bg-stone/10 rounded w-1/2 mx-auto" />
          </div>
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 px-6 py-3 border-t border-stone/20">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-4 bg-stone/10 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const { items, remove, clear } = useCompare();
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const ids = items.map((i) => i.id).join(",");

  useEffect(() => {
    if (!ids) { setProducts([]); setLoading(false); setFetchError(false); return; }
    const controller = new AbortController();
    setLoading(true);
    setFetchError(false);
    fetch(`/api/products/compare?ids=${ids}`, { signal: controller.signal })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error("api")))
      .then((data) => setProducts(data))
      .catch((err) => {
        if (err.name !== "AbortError") { setProducts([]); setFetchError(true); }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [ids, retryCount]);

  // Items that are in localStorage but weren't returned by the API (deactivated/deleted)
  const orphanedItems = items.filter((item) => !products.find((p) => p.id === item.id));

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4"
        dir="rtl"
      >
        <div className="w-20 h-20 rounded-full bg-stone/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-secondary">compare_arrows</span>
        </div>
        <h1 className="text-2xl font-bold text-obsidian">لا توجد منتجات للمقارنة</h1>
        <p className="text-secondary text-sm max-w-xs">
          أضف منتجين على الأقل عبر زر المقارنة{" "}
          <span className="material-symbols-outlined text-[14px] align-middle">compare_arrows</span>{" "}
          في كارت المنتج
        </p>
        <Link
          href="/products"
          className="mt-2 bg-tashtep-orange text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const productCount = items.length;
  const countLabel =
    productCount === 1 ? "منتج واحد" : productCount === 2 ? "منتجان" : "3 منتجات";

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-10" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-obsidian">مقارنة المنتجات</h1>
            <p className="text-secondary text-sm mt-0.5">{countLabel} محدد{productCount > 1 ? "ة" : ""}</p>
          </div>
          <button
            onClick={clear}
            className="text-xs text-secondary hover:text-red-500 flex items-center gap-1 transition-colors border border-stone/60 px-3 py-1.5 rounded-lg"
          >
            <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
            مسح الكل
          </button>
        </div>

        {/* Orphaned items — in localStorage but deactivated/deleted from DB */}
        {!loading && !fetchError && orphanedItems.length > 0 && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">warning</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">منتجات لم تعد متاحة</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {orphanedItems.map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center gap-1.5 bg-white border border-amber-200 text-amber-700 text-xs px-2 py-1 rounded-lg"
                  >
                    {item.name}
                    <button
                      onClick={() => remove(item.id)}
                      className="hover:text-red-500 transition-colors"
                      aria-label="إزالة"
                    >
                      <span className="material-symbols-outlined text-[13px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full fetch error — all products failed to load */}
        {!loading && fetchError && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-red-400">cloud_off</span>
            </div>
            <p className="text-obsidian font-bold">تعذّر تحميل بيانات المنتجات</p>
            <p className="text-secondary text-sm">تحقق من اتصالك بالإنترنت وحاول مجدداً</p>
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="mt-1 bg-tashtep-orange text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {loading ? (
          <TableSkeleton />
        ) : (!fetchError || products.length > 0) && (
          <div className="overflow-x-auto rounded-2xl border border-stone/60 shadow-sm bg-white">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>

              {/* ── Product header row ─────────────────────── */}
              <thead>
                <tr className="border-b border-stone/60">
                  {/* Sticky label column */}
                  <th className="p-4 bg-stone/10 text-right text-secondary font-medium w-36 border-e border-stone/40 sticky right-0 z-10 bg-[#f4f2ef]" />

                  {products.map((p, idx) => (
                    <th
                      key={p.id}
                      className="p-4 text-center border-e border-stone/40 last:border-e-0 min-w-[200px]"
                    >
                      <div className="relative w-28 h-28 mx-auto rounded-xl overflow-hidden bg-stone/20 mb-3">
                        {p.image ? (
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="material-symbols-outlined text-stone-400 text-3xl">category</span>
                          </div>
                        )}
                        {idx === 0 && products.length > 1 && (
                          <div className="absolute top-1 right-1 bg-tashtep-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            الأول
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/products/${p.id}`}
                        className="font-bold text-obsidian hover:text-tashtep-orange text-sm leading-tight line-clamp-2 block mb-2"
                      >
                        {p.name}
                      </Link>
                      <button
                        onClick={() => remove(p.id)}
                        className="text-[11px] text-secondary hover:text-red-500 flex items-center gap-0.5 mx-auto transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">close</span>
                        إزالة
                      </button>
                    </th>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: 3 - products.length }).map((_, i) => (
                    <th
                      key={`empty-${i}`}
                      className="p-4 text-center border-e border-stone/40 last:border-e-0 min-w-[200px]"
                    >
                      <Link
                        href="/products"
                        className="flex flex-col items-center gap-2 text-secondary hover:text-tashtep-orange transition-colors group"
                      >
                        <div className="w-28 h-28 border-2 border-dashed border-current rounded-xl flex items-center justify-center mx-auto group-hover:border-tashtep-orange transition-colors">
                          <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <span className="text-xs font-medium">أضف منتجاً للمقارنة</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── Data rows ──────────────────────────────── */}
              <tbody>
                {ROWS.map((row, rowIdx) => {
                  const values = products.map((p) => p[row.key]);
                  const numericValues = values
                    .map((v) => Number(v))
                    .filter((n) => !isNaN(n) && n > 0);

                  const bestVal =
                    row.highlight === "min"
                      ? Math.min(...numericValues)
                      : row.highlight === "max"
                      ? Math.max(...numericValues)
                      : null;

                  return (
                    <tr key={row.key} className={rowIdx % 2 === 0 ? "bg-white" : "bg-stone/5"}>
                      {/* Sticky label */}
                      <td className="p-4 font-medium text-secondary text-sm border-e border-b border-stone/40 sticky right-0 z-10 bg-[#f4f2ef] whitespace-nowrap">
                        {row.label}
                      </td>

                      {products.map((p) => {
                        const val = p[row.key];
                        const numVal = Number(val);
                        const isBest =
                          bestVal !== null &&
                          !isNaN(numVal) &&
                          numVal > 0 &&
                          numVal === bestVal &&
                          numericValues.length > 1;

                        return (
                          <td
                            key={p.id}
                            className={cn(
                              "p-4 text-center border-e border-b border-stone/40 last:border-e-0 transition-colors",
                              isBest ? "bg-green-50 text-green-700" : "text-obsidian"
                            )}
                          >
                            <div className="flex flex-col items-center gap-1">
                              {row.render ? row.render(val, values) : String(val ?? "—")}
                              {isBest && (
                                <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                  {row.highlight === "min" ? "الأقل سعراً" : "الأفضل"}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {Array.from({ length: 3 - products.length }).map((_, i) => (
                        <td
                          key={`empty-${i}`}
                          className="p-4 border-e border-b border-stone/40 last:border-e-0 bg-stone/5"
                        />
                      ))}
                    </tr>
                  );
                })}

                {/* ── CTA row ────────────────────────────────── */}
                <tr>
                  <td className="p-4 border-e border-stone/40 sticky right-0 z-10 bg-[#f4f2ef]" />
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-e border-stone/40 last:border-e-0">
                      <div className="flex flex-col gap-2">
                        <AddToCartBtn product={p} />
                        <WishlistBtn product={p} />
                        <Link
                          href={`/products/${p.id}`}
                          className="w-full text-center border border-stone/60 text-obsidian py-2 rounded-xl text-sm font-medium hover:border-obsidian transition-colors"
                        >
                          عرض التفاصيل
                        </Link>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - products.length }).map((_, i) => (
                    <td
                      key={`empty-${i}`}
                      className="p-4 border-e border-stone/40 last:border-e-0 bg-stone/5"
                    />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
