import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type CartItemType } from "@/features/cart/components/cart-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const POINTS_CASH_RATE = 0.25; // 1 point = 0.25 EGP

interface OrderSummaryProps {
  items: CartItemType[];
  shippingCost?: number;
  discountAmount?: number;
  couponCode?: string;
  onApplyCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
  couponError?: string;
  isApplyingCoupon?: boolean;
  giftCardCode?: string;
  giftCardDiscount?: number;
  onApplyGiftCard?: (code: string) => void;
  onRemoveGiftCard?: () => void;
  giftCardError?: string;
  isApplyingGiftCard?: boolean;
  loyaltyBalance?: number;
  loyaltyPointsToRedeem?: number;
  onChangeLoyaltyPoints?: (points: number) => void;
}

export function OrderSummary({
  items,
  shippingCost = 0,
  discountAmount = 0,
  couponCode = "",
  onApplyCoupon,
  onRemoveCoupon,
  couponError,
  isApplyingCoupon,
  giftCardCode = "",
  giftCardDiscount = 0,
  onApplyGiftCard,
  onRemoveGiftCard,
  giftCardError,
  isApplyingGiftCard,
  loyaltyBalance = 0,
  loyaltyPointsToRedeem = 0,
  onChangeLoyaltyPoints,
}: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((subtotalAfterDiscount * 0.14).toFixed(2));
  const totalBeforeGiftCard = subtotalAfterDiscount + shippingCost + taxAmount;
  const effectiveGiftCardDiscount = Math.min(giftCardDiscount, totalBeforeGiftCard);
  const totalBeforeLoyalty = Math.max(0, totalBeforeGiftCard - effectiveGiftCardDiscount);

  const maxRedeemablePoints = Math.min(loyaltyBalance, Math.floor((totalBeforeLoyalty * 0.3) / POINTS_CASH_RATE));
  const loyaltyDiscount = Number((loyaltyPointsToRedeem * POINTS_CASH_RATE).toFixed(2));
  const total = Math.max(0, totalBeforeLoyalty - loyaltyDiscount);

  const [couponInput, setCouponInput] = React.useState("");
  const [giftCardInput, setGiftCardInput] = React.useState("");

  return (
    <Card className="w-full bg-secondary/20 border-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground line-clamp-1 max-w-[70%]">
              {item.name}
              {item.variantLabel && <span className="text-xs"> ({item.variantLabel})</span>}
              {" "}
              <span className="text-xs font-bold px-1 bg-background rounded-md ml-1">x{item.quantity}</span>
            </span>
            <span className="font-medium whitespace-nowrap">{item.price * item.quantity} ج.م</span>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-sm text-muted-foreground py-4 text-center">لا توجد منتجات</div>
        )}

        {/* Coupon Code */}
        <div className="border-t pt-4">
          <p className="text-xs font-bold text-obsidian mb-2">كود الخصم</p>
          <div className="flex gap-2">
            <Input
              placeholder="أدخل كود الخصم"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              disabled={!!couponCode || isApplyingCoupon}
              className="bg-white"
            />
            {!couponCode ? (
              <Button
                variant="secondary"
                onClick={() => { if (couponInput.trim() && onApplyCoupon) onApplyCoupon(couponInput.trim()); }}
                disabled={!couponInput.trim() || isApplyingCoupon}
              >
                تطبيق
              </Button>
            ) : (
              <Button variant="outline" onClick={() => { setCouponInput(""); if (onRemoveCoupon) onRemoveCoupon(); }}>
                إلغاء
              </Button>
            )}
          </div>
          {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
          {couponCode && !couponError && (
            <p className="text-green-600 text-xs mt-2">تم تطبيق كود الخصم {couponCode} ✓</p>
          )}
        </div>

        {/* Gift Card */}
        <div className="border-t pt-4">
          <p className="text-xs font-bold text-obsidian mb-2">كرت الهدية</p>
          <div className="flex gap-2">
            <Input
              placeholder="أدخل كود الكرت"
              value={giftCardInput}
              onChange={(e) => setGiftCardInput(e.target.value)}
              disabled={!!giftCardCode || isApplyingGiftCard}
              className="bg-white"
              dir="ltr"
            />
            {!giftCardCode ? (
              <Button
                variant="secondary"
                onClick={() => { if (giftCardInput.trim() && onApplyGiftCard) onApplyGiftCard(giftCardInput.trim()); }}
                disabled={!giftCardInput.trim() || isApplyingGiftCard}
              >
                تطبيق
              </Button>
            ) : (
              <Button variant="outline" onClick={() => { setGiftCardInput(""); if (onRemoveGiftCard) onRemoveGiftCard(); }}>
                إلغاء
              </Button>
            )}
          </div>
          {giftCardError && <p className="text-red-500 text-xs mt-2">{giftCardError}</p>}
          {giftCardCode && !giftCardError && (
            <p className="text-green-600 text-xs mt-2">كرت الهدية {giftCardCode} — خصم {effectiveGiftCardDiscount} ج.م ✓</p>
          )}
        </div>

        {/* Totals */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span className="font-medium">{subtotal} ج.م</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">تكلفة الشحن</span>
            <span className="font-medium">{shippingCost} ج.م</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm text-green-600 font-medium">
              <span>خصم الكوبون</span>
              <span>-{discountAmount} ج.م</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">ضريبة القيمة المضافة (14%)</span>
            <span className="font-medium">{taxAmount} ج.م</span>
          </div>
          {effectiveGiftCardDiscount > 0 && (
            <div className="flex justify-between items-center text-sm text-green-600 font-medium">
              <span>كرت الهدية</span>
              <span>-{effectiveGiftCardDiscount} ج.م</span>
            </div>
          )}
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between items-center text-sm text-amber-600 font-medium">
              <span>نقاط الولاء ({loyaltyPointsToRedeem} نقطة)</span>
              <span>-{loyaltyDiscount} ج.م</span>
            </div>
          )}
        </div>

        {/* Loyalty Points */}
        {loyaltyBalance > 0 && onChangeLoyaltyPoints && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-obsidian flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-amber-500">stars</span>
                نقاط الولاء
              </p>
              <span className="text-xs text-secondary">{loyaltyBalance} نقطة متاحة = {(loyaltyBalance * POINTS_CASH_RATE).toFixed(2)} ج.م</span>
            </div>
            {maxRedeemablePoints > 0 ? (
              <>
                <input
                  type="range"
                  min={0}
                  max={maxRedeemablePoints}
                  step={1}
                  value={loyaltyPointsToRedeem}
                  onChange={(e) => onChangeLoyaltyPoints(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-secondary mt-1">
                  <span>0 نقطة</span>
                  <span className="text-amber-600 font-medium">{loyaltyPointsToRedeem} نقطة = {loyaltyDiscount} ج.م خصم</span>
                  <span>{maxRedeemablePoints} نقطة</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-secondary">لا يمكن استرداد نقاط على هذا الطلب (الحد الأقصى 30% من قيمة الطلب)</p>
            )}
          </div>
        )}

        <div className="border-t pt-4 flex justify-between items-center mt-2">
          <span className="font-bold text-lg text-obsidian">الإجمالي النهائي</span>
          <span className="font-black text-2xl text-tashtep-orange">{total} ج.م</span>
        </div>
      </CardContent>
    </Card>
  );
}
