"use client";

import * as React from "react";
import { ShoppingCart, Loader2, Minus, Plus, Zap, Link2, Truck, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart, guestCartItemId } from "@/hooks/useCart";
import { type ProductVariantUI } from "./product-card";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { toast } from "sonner";
import { type Product } from "@/features/products/components/product-card";
import { CrossSellToast } from "@/features/cart/components/cross-sell-toast";
import { useInventory } from "@/hooks/use-inventory";

interface ProductPurchasePanelProps {
  productId: string;
  productName: string;
  price: number;
  image?: string;
  stock?: number;
  variants?: ProductVariantUI[];
  crossSells?: Product[];
  unitLabel?: string | null;
  unitSize?: number | null;
  deliveryDays?: string | null;
  maxOrderQty?: number | null;
}

function StockBadge({ stock }: { stock: number | undefined }) {
  if (stock === undefined) return null;
  if (stock === 0) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
        <XCircle className="h-4 w-4 shrink-0" />
        نفدت الكمية من المخزون
      </div>
    );
  }
  if (stock <= 5) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        تبقى {stock} قطع فقط — اطلب الآن!
      </div>
    );
  }
  if (stock <= 20) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        كمية محدودة في المخزون
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      متوفر في المخزون
    </div>
  );
}

function PaymentIcons() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-secondary">وسائل الدفع:</span>
      {[
        { label: "فيزا", bg: "bg-blue-600" },
        { label: "ماستر", bg: "bg-red-600" },
        { label: "COD", bg: "bg-emerald-600" },
        { label: "فوري", bg: "bg-orange-500" },
      ].map(({ label, bg }) => (
        <span key={label} className={`${bg} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
          {label}
        </span>
      ))}
    </div>
  );
}

export function ProductPurchasePanel({
  productId,
  productName,
  price,
  image = "",
  stock: initialStock,
  variants,
  crossSells,
  unitLabel,
  unitSize,
  deliveryDays,
  maxOrderQty,
}: ProductPurchasePanelProps) {
  const { stock: realTimeStock } = useInventory(productId, initialStock ?? null);
  const stock = realTimeStock ?? initialStock;
  const maxQty = maxOrderQty ?? 99;

  const router = useRouter();
  const { status } = useSession();
  const { addItem } = useCart();
  const [isPendingCart, startTransitionCart] = React.useTransition();
  const [isPendingBuyNow, startTransitionBuyNow] = React.useTransition();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [isPanelVisible, setIsPanelVisible] = React.useState(true);
  const [qty, setQty] = React.useState(1);
  const [copied, setCopied] = React.useState(false);

  const colors = React.useMemo(() => variants?.filter((v) => v.type === "COLOR") || [], [variants]);
  const sizes = React.useMemo(() => variants?.filter((v) => v.type === "SIZE") || [], [variants]);
  const [selectedColorId, setSelectedColorId] = React.useState<string | undefined>(colors[0]?.id);
  const [selectedSizeId, setSelectedSizeId] = React.useState<string | undefined>(sizes[0]?.id);

  const activeVariantId = selectedSizeId || selectedColorId;
  const selectedColor = colors.find((c) => c.id === selectedColorId);

  const pricePerUnit = unitLabel && unitSize && unitSize > 0
    ? Math.round(price / unitSize)
    : null;

  React.useEffect(() => {
    if (!panelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPanelVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (stock !== undefined && stock > 0 && stock <= 5) {
      const timer = setTimeout(() => {
        toast(`أسرع! تبقى ${stock} قطع فقط في المخزون 🔥`, {
          position: "top-center",
          style: { background: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2", fontWeight: "bold" },
          duration: 5000,
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stock]);

  const addGuestItem = () => {
    addItem({
      id: guestCartItemId(productId, activeVariantId),
      productId,
      variantId: activeVariantId,
      name: productName,
      price,
      quantity: qty,
      image,
    });
  };

  const showAddedToast = () => {
    if (crossSells && crossSells.length > 0) {
      toast.custom((t) => (
        <CrossSellToast productName={productName} crossSells={crossSells} onDismiss={() => toast.dismiss(t)} />
      ), { duration: 10000 });
    } else {
      toast.success(`تمت إضافة ${qty > 1 ? qty + " قطع" : "المنتج"} للسلة`, { position: "top-center" });
    }
  };

  const handleAddToCart = () => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      addGuestItem();
      showAddedToast();
      return;
    }
    startTransitionCart(async () => {
      const result = await addToCartAction({ productId, variantId: activeVariantId, quantity: qty });
      if (result?.success) {
        router.refresh();
        showAddedToast();
      } else if (result?.error) {
        toast.error(result.error, { position: "top-center" });
      }
    });
  };

  const handleBuyNow = () => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      addGuestItem();
      router.push("/checkout");
      return;
    }
    startTransitionBuyNow(async () => {
      const result = await addToCartAction({ productId, variantId: activeVariantId, quantity: qty });
      if (result?.success) {
        router.push("/checkout");
      } else if (result?.error) {
        toast.error(result.error, { position: "top-center" });
      }
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("تم نسخ رابط المنتج", { position: "top-center" });
    } catch {
      toast.error("تعذر نسخ الرابط", { position: "top-center" });
    }
  };

  const whatsappUrl = typeof window !== "undefined"
    ? `https://wa.me/?text=${encodeURIComponent(productName + " — " + window.location.href)}`
    : "#";

  const isDisabled = stock === 0;

  return (
    <>
      <div ref={panelRef} className="flex flex-col gap-5">

        {/* stock badge */}
        <StockBadge stock={stock} />

        {/* سعر الوحدة */}
        {pricePerUnit && (
          <div className="text-sm text-secondary">
            السعر لكل {unitLabel}: <span className="font-bold text-obsidian">{pricePerUnit} ج.م</span>
          </div>
        )}

        {/* ألوان */}
        {colors.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-label-md text-label-md text-obsidian font-bold">
                اللون: <span className="font-normal text-secondary">{selectedColor?.label}</span>
              </span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  aria-label={color.label}
                  onClick={() => setSelectedColorId(color.id)}
                  className={`w-11 h-11 rounded-full border shadow-sm transition-all ${
                    selectedColorId === color.id ? "ring-2 ring-offset-2 ring-obsidian" : "border-stone hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>
        )}

        {/* أحجام */}
        {sizes.length > 0 && (
          <div>
            <span className="block font-label-md text-label-md text-obsidian font-bold mb-3">الحجم</span>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSizeId(size.id)}
                  className={`py-3 px-4 rounded font-label-md text-label-md text-center border transition-colors ${
                    selectedSizeId === size.id
                      ? "border-obsidian bg-white text-obsidian"
                      : "border-stone bg-stone text-charcoal hover:border-obsidian hover:bg-white"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* محدد الكمية */}
        <div>
          <span className="block font-label-md text-label-md text-obsidian font-bold mb-3">الكمية</span>
          <div className="flex items-center border border-stone rounded-lg w-fit overflow-hidden">
            <button
              type="button"
              aria-label="تقليل الكمية"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1 || isDisabled}
              className="w-11 h-11 flex items-center justify-center text-obsidian hover:bg-stone transition-colors disabled:opacity-40 border-l border-stone"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-14 text-center font-bold text-obsidian text-base select-none">{qty}</span>
            <button
              type="button"
              aria-label="زيادة الكمية"
              onClick={() => setQty((q) => {
                const next = q + 1;
                if (stock !== undefined && next > stock) return q;
                return Math.min(next, maxQty);
              })}
              disabled={qty >= maxQty || (stock !== undefined && qty >= stock) || isDisabled}
              className="w-11 h-11 flex items-center justify-center text-obsidian hover:bg-stone transition-colors disabled:opacity-40 border-r border-stone"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {maxOrderQty && (
            <p className="text-xs text-secondary mt-1">الحد الأقصى للطلب: {maxOrderQty} قطعة</p>
          )}
        </div>

        {/* أزرار الشراء */}
        <div className="flex gap-3 flex-wrap">
          <Button
            className="rounded-full bg-obsidian text-white hover:bg-obsidian/90 flex-1 min-w-[130px] gap-2"
            onClick={handleAddToCart}
            disabled={isPendingCart || isPendingBuyNow || isDisabled}
          >
            {isPendingCart ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
            {isDisabled ? "نفدت الكمية" : "أضف للسلة"}
          </Button>

          {!isDisabled && (
            <Button
              className="rounded-full bg-tashtep-orange text-white hover:bg-tashtep-orange/90 flex-1 min-w-[130px] gap-2"
              onClick={handleBuyNow}
              disabled={isPendingCart || isPendingBuyNow}
            >
              {isPendingBuyNow ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              اشتري الآن
            </Button>
          )}
        </div>

        {/* Wishlist + Share */}
        <div className="flex items-center gap-2">
          <WishlistButton productId={productId} variant="outline" />

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="مشاركة على واتساب">
              <svg className="h-4 w-4 fill-emerald-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </Button>
          </a>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="نسخ رابط المنتج"
            onClick={handleShare}
          >
            <Link2 className={`h-4 w-4 ${copied ? "text-emerald-600" : ""}`} />
          </Button>
        </div>

        {/* معلومات التوصيل */}
        {deliveryDays && (
          <div className="flex items-center gap-2 text-sm text-secondary bg-stone/50 rounded-lg px-3 py-2.5 border border-stone">
            <Truck className="h-4 w-4 text-obsidian shrink-0" />
            <span>يصلك خلال <strong className="text-obsidian">{deliveryDays} أيام عمل</strong> — شحن لجميع محافظات مصر</span>
          </div>
        )}

        {/* وسائل الدفع */}
        <PaymentIcons />

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone">
          {[
            { icon: "local_shipping", label: "شحن لكل مصر" },
            { icon: "verified", label: "منتجات أصلية 100%" },
            { icon: "support_agent", label: "دعم فني متخصص" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span className="material-symbols-outlined text-tashtep-orange text-[20px]">{icon}</span>
              <span className="text-[11px] text-secondary leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Add-to-Cart Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone z-50 shadow-sm transition-transform duration-200 ease-in-out ${
          isPanelVisible ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-container-max mx-auto px-gutter py-3 flex items-center justify-between gap-4">
          <span className="font-headline-md text-[16px] text-obsidian line-clamp-1 hidden sm:block">{productName}</span>
          <div className="flex items-center gap-3 flex-1 sm:flex-none justify-between sm:justify-end">
            <span className="font-headline-md text-[18px] text-obsidian whitespace-nowrap">{price} ج.م</span>
            <div className="flex items-center border border-stone rounded-lg overflow-hidden">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="w-9 h-9 flex items-center justify-center hover:bg-stone disabled:opacity-40 border-l border-stone">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold">{qty}</span>
              <button type="button" onClick={() => setQty((q) => { const next = q + 1; if (stock !== undefined && next > stock) return q; return Math.min(next, maxQty); })} disabled={qty >= maxQty || (stock !== undefined && qty >= stock)} className="w-9 h-9 flex items-center justify-center hover:bg-stone disabled:opacity-40 border-r border-stone">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button
              size="default"
              className="rounded bg-tashtep-orange text-white hover:opacity-90 min-w-[110px]"
              onClick={handleAddToCart}
              disabled={isPendingCart || isDisabled}
            >
              {isPendingCart ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              {isDisabled ? "نفدت الكمية" : "أضف للسلة"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
