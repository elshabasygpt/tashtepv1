"use client";

import * as React from "react";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { type CartItemType } from "@/features/cart/components/cart-item";
import { Governorate } from "@prisma/client";
import { validateCouponAction } from "@/actions/coupon.actions";
import { validateGiftCardAction } from "@/actions/giftcard.actions";

interface CheckoutClientWrapperProps {
  cartItems: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }[];
  mappedItems: CartItemType[];
  defaultValues?: {
    fullName?: string;
    phone?: string;
  };
  governorates: Governorate[];
  isGuest?: boolean;
  loyaltyBalance?: number;
}

export function CheckoutClientWrapper({
  cartItems,
  mappedItems,
  defaultValues,
  governorates,
  isGuest,
  loyaltyBalance = 0,
}: CheckoutClientWrapperProps) {
  const [shippingCost, setShippingCost] = React.useState(0);

  // Coupon state
  const [couponCode, setCouponCode] = React.useState("");
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [couponError, setCouponError] = React.useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);

  // Gift card state
  const [giftCardCode, setGiftCardCode] = React.useState("");
  const [giftCardDiscount, setGiftCardDiscount] = React.useState(0);
  const [giftCardError, setGiftCardError] = React.useState("");
  const [isApplyingGiftCard, setIsApplyingGiftCard] = React.useState(false);

  // Loyalty points state
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = React.useState(0);

  const subtotal = mappedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const mobileTotal = React.useMemo(() => {
    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const tax = Number((subtotalAfterDiscount * 0.14).toFixed(2));
    const beforeGift = subtotalAfterDiscount + shippingCost + tax;
    const giftApplied = Math.min(giftCardDiscount, beforeGift);
    const beforeLoyalty = Math.max(0, beforeGift - giftApplied);
    const loyaltyVal = Number((loyaltyPointsToRedeem * 0.25).toFixed(2));
    return Math.max(0, beforeLoyalty - loyaltyVal);
  }, [subtotal, discountAmount, shippingCost, giftCardDiscount, loyaltyPointsToRedeem]);

  const handleCityChange = (cityName: string) => {
    const gov = governorates.find((g) => g.name === cityName);
    setShippingCost(gov?.shippingCost || 0);
  };

  const handleApplyCoupon = async (code: string) => {
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const result = await validateCouponAction({ code, cartTotal: subtotal });
      if (result?.data?.isValid) {
        setCouponCode(code);
        setDiscountAmount(result.data.discountAmount);
      } else {
        setCouponError(result?.data?.error || "الكود غير صحيح");
        setCouponCode("");
        setDiscountAmount(0);
      }
    } catch {
      setCouponError("حدث خطأ أثناء التحقق");
      setCouponCode("");
      setDiscountAmount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setCouponError("");
  };

  const handleApplyGiftCard = async (code: string) => {
    setIsApplyingGiftCard(true);
    setGiftCardError("");
    try {
      const result = await validateGiftCardAction({ code });
      if (result?.data?.valid) {
        setGiftCardCode(code.toUpperCase());
        setGiftCardDiscount(result.data.balance);
      } else {
        setGiftCardError(result?.data?.error || "كود الكرت غير صحيح");
        setGiftCardCode("");
        setGiftCardDiscount(0);
      }
    } catch {
      setGiftCardError("حدث خطأ أثناء التحقق");
      setGiftCardCode("");
      setGiftCardDiscount(0);
    } finally {
      setIsApplyingGiftCard(false);
    }
  };

  const handleRemoveGiftCard = () => {
    setGiftCardCode("");
    setGiftCardDiscount(0);
    setGiftCardError("");
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Order summary — first on mobile, right sidebar on desktop */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-28 bg-stone/50 rounded-xl p-gutter border border-soft-border">
            <OrderSummary
              items={mappedItems}
              shippingCost={shippingCost}
              discountAmount={discountAmount}
              couponCode={couponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              couponError={couponError}
              isApplyingCoupon={isApplyingCoupon}
              giftCardCode={giftCardCode}
              giftCardDiscount={giftCardDiscount}
              onApplyGiftCard={handleApplyGiftCard}
              onRemoveGiftCard={handleRemoveGiftCard}
              giftCardError={giftCardError}
              isApplyingGiftCard={isApplyingGiftCard}
              loyaltyBalance={loyaltyBalance}
              loyaltyPointsToRedeem={loyaltyPointsToRedeem}
              onChangeLoyaltyPoints={setLoyaltyPointsToRedeem}
            />

            <div className="mt-8 flex justify-between items-center pt-6 border-t border-surface-container-high opacity-80">
              {[
                { icon: "lock", label: "دفع مؤمّن بالكامل" },
                { icon: "local_shipping", label: "شحن لجميع المحافظات" },
                { icon: "replay", label: "إرجاع خلال 14 يوم" },
              ].map((item) => (
                <div key={item.icon} className="flex flex-col items-center gap-1 text-center">
                  <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                  <span className="font-technical-mono text-[10px] text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout form — second on mobile, left column on desktop */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <CheckoutForm
            cartItems={cartItems}
            defaultValues={defaultValues}
            governorates={governorates}
            onCityChange={handleCityChange}
            couponCode={couponCode}
            giftCardCode={giftCardCode}
            loyaltyPointsToRedeem={loyaltyPointsToRedeem}
            isGuest={isGuest}
          />
        </div>
      </div>

      {/* Mobile sticky bottom bar — shows running total while filling the form */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-soft-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-secondary font-medium">الإجمالي النهائي</p>
          <p className="text-xl font-black text-tashtep-orange tabular-nums">{new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(mobileTotal)} ج.م</p>
        </div>
        <p className="text-[10px] text-secondary text-start max-w-[140px] leading-tight">
          ✓ دفع آمن · إرجاع 14 يوم
        </p>
      </div>
      {/* Bottom padding so the form submit button isn't hidden behind the sticky bar on mobile */}
      <div className="lg:hidden h-20" />
    </>
  );
}
