# خطة تحسين UX صفحة المنتج — تشطيب v1

**التاريخ:** 2026-06-28  
**الأولوية:** عالية — تأثير مباشر على معدل التحويل

---

## الهدف

إضافة 8 تحسينات UX على صفحة المنتج بحيث يتحكم فيها المدير من لوحة الإدارة عند إضافة أو تعديل أي منتج.

---

## ملخص التغييرات

| الطبقة | الملفات المتأثرة | نوع التغيير |
|--------|----------------|-------------|
| DB | `prisma/schema.prisma` | 4 حقول جديدة |
| Migration | `prisma/migrations/...` | `db push` |
| Actions | `src/actions/admin.actions.ts` | قراءة وحفظ الحقول الجديدة |
| Admin Form | `src/components/admin/admin-product-form.tsx` | قسمين جديدين |
| Product Page | `src/app/products/[id]/page.tsx` | تمرير البيانات الجديدة |
| Purchase Panel | `src/features/products/components/product-purchase-panel.tsx` | 5 إضافات |
| Reviews | `src/features/products/components/product-reviews.tsx` | histogram + verified badge |

---

## Phase 1 — إضافة حقول جديدة في قاعدة البيانات

### الحقول المضافة على `model Product` في `prisma/schema.prisma`

```prisma
unitLabel    String?   // وحدة القياس: "لتر" / "م²" / "كيلو" / "متر طولي"
unitSize     Float?    // الكمية في العبوة: 9.0 لعبوة 9 لتر — يُستخدم لحساب السعر/وحدة
deliveryDays String?   // أيام التوصيل: "2-3" أو "5-7" — يظهر كـ "يصلك خلال X أيام"
maxOrderQty  Int?      // الحد الأقصى في محدد الكمية (default يكون 99)
specs        String?   // JSON string: "[{\"label\":\"التغطية\",\"value\":\"10 م²/لتر\"}]"
```

> ملاحظة: `specs` تُخزن كـ JSON string لأن SQLite لا يدعم Json type بشكل مستقر.

### الأمر:
```bash
npx prisma db push
```

---

## Phase 2 — تحديث Admin Product Form

**الملف:** `src/components/admin/admin-product-form.tsx`

### 2.1 إضافة الحقول للـ state

```ts
// في initialData interface
unitLabel?: string | null;
unitSize?: number | null;
deliveryDays?: string | null;
maxOrderQty?: number | null;
specs?: string | null;
oemNumber?: string | null;

// في useState
unitLabel: initialData?.unitLabel || "",
unitSize: initialData?.unitSize?.toString() || "",
deliveryDays: initialData?.deliveryDays || "",
maxOrderQty: initialData?.maxOrderQty?.toString() || "",
specsRaw: initialData?.specs || "[]",   // JSON string للعرض
oemNumber: initialData?.oemNumber || "",
```

### 2.2 إضافة قسم "تفاصيل المنتج التقنية" في النموذج

**يُضاف بعد قسم الوصف مباشرةً:**

```
┌─────────────────────────────────────────────────────────────┐
│  تفاصيل المنتج التقنية                                        │
├─────────────────────────────────────────────────────────────┤
│  وحدة القياس        │  الكمية في الوحدة                        │
│  [لتر ▼]           │  [9]                                    │
│  ← يظهر كـ "السعر لكل لتر: XX ج.م"                           │
├─────────────────────────────────────────────────────────────┤
│  رقم الموديل (OEM)                                            │
│  [________________]                                          │
├─────────────────────────────────────────────────────────────┤
│  مواصفات المنتج (جدول)                                        │
│  ┌──────────────────────┬──────────────────────┬────┐       │
│  │ التغطية              │ 10 م²/لتر            │ ✕  │       │
│  │ وقت الجفاف          │ ساعتان               │ ✕  │       │
│  └──────────────────────┴──────────────────────┴────┘       │
│  [+ إضافة مواصفة]                                            │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 إضافة قسم "إعدادات الشراء"

**يُضاف بعد قسم التفاصيل:**

```
┌─────────────────────────────────────────────────────────────┐
│  إعدادات الشراء                                              │
├─────────────────────────────────────────────────────────────┤
│  أيام التوصيل                 │  الحد الأقصى للطلب           │
│  [2-3]                        │  [99]                        │
│  ← يظهر: "يصلك خلال 2-3 أيام" │  ← الحد في محدد الكمية        │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Specs Editor Component (مكوّن inline داخل الفورم)

منطق بسيط بدون library جديدة:

```ts
// State: specsRows = [{label: string, value: string}]
// Parse: JSON.parse(specsRaw) أو []
// Render: map over specsRows → 2 inputs + remove button
// Add: append empty row
// Serialize: JSON.stringify(specsRows) → specsRaw قبل الحفظ
```

---

## Phase 3 — تحديث Purchase Panel

**الملف:** `src/features/products/components/product-purchase-panel.tsx`

### Props الجديدة

```ts
interface ProductPurchasePanelProps {
  // ... الموجودة
  unitLabel?: string | null;
  unitSize?: number | null;
  deliveryDays?: string | null;
  maxOrderQty?: number | null;
}
```

### 3.1 Quantity Selector

يُضاف **فوق** زرار "أضف للسلة":

```
┌─────────────────────────────────────────────────────┐
│  الكمية                                              │
│  ┌────┬───────────┬────┐                            │
│  │ −  │     2     │ +  │   (max = maxOrderQty ?? 99) │
│  └────┴───────────┴────┘                            │
└─────────────────────────────────────────────────────┘
```

- State: `const [qty, setQty] = React.useState(1)`
- تمرير `quantity: qty` لـ `addToCartAction`
- الـ sticky bar يعرض الكمية أيضاً

### 3.2 Buy Now Button

يُضاف **بجانب** "أضف للسلة":

```ts
// يضيف للسلة ثم يعمل redirect مباشرة لـ /checkout
const handleBuyNow = () => {
  startTransitionCart(async () => {
    await addToCartAction({ productId, variantId: activeVariantId, quantity: qty });
    router.push("/checkout");
  });
};
```

التصميم: زرار border أو filled بلون مختلف (outlined obsidian بجانب filled orange).

### 3.3 Stock Badge الدائم

يُضاف **فوق** زرار الشراء مباشرةً:

```
if (stock === 0)     → ❌ نفدت الكمية
if (stock <= 5)      → 🔥 تبقى {stock} قطع فقط
if (stock <= 20)     → ✓ كمية محدودة
else                 → ✓ متوفر في المخزون
```

### 3.4 Delivery Estimate

يُضاف **أسفل** زرار الشراء:

```
إذا كان deliveryDays موجوداً:
🚚 يصلك خلال {deliveryDays} أيام عمل — شحن لجميع محافظات مصر
```

### 3.5 Price Per Unit

يُضاف **بجانب** السعر الرئيسي:

```
إذا كان unitLabel و unitSize موجودَين:
السعر: 450 ج.م
السعر لكل لتر: 50 ج.م   ← (price / unitSize).toFixed(0)
```

### 3.6 Payment Icons

يُضاف **أسفل** delivery estimate:

```
[💳 فيزا] [💳 ماستركارد] [💵 كاش عند الاستلام] [🔄 فوري]
```
أيقونات SVG/text بسيطة — بدون library.

### 3.7 WhatsApp Share + Copy Link

يُضاف **بجانب** WishlistButton:

```tsx
<a href={`https://wa.me/?text=${encodeURIComponent(productName + " " + url)}`} target="_blank">
  <Button variant="outline" size="icon"><WhatsappIcon /></Button>
</a>
<Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(url)}>
  <Link2 />
</Button>
```

---

## Phase 4 — تحديث Reviews Section

**الملف:** `src/features/products/components/product-reviews.tsx`

### 4.1 Rating Histogram

يُضاف **فوق** قائمة التقييمات:

```
تقييم عام
4.2 ★
─────────────────────
5 ★ ████████░░ 60%  (18)
4 ★ █████░░░░░ 35%  (10)
3 ★ █░░░░░░░░░  5%   (2)
2 ★ ░░░░░░░░░░  0%   (0)
1 ★ ░░░░░░░░░░  0%   (0)
```

Logic:
```ts
const histogram = [5,4,3,2,1].map(star => ({
  star,
  count: reviews.filter(r => r.rating === star).length,
  pct: reviews.length ? Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100) : 0
}));
```

### 4.2 Verified Purchase Badge

على كل review card يحمل `verifiedPurchase: true`:

```
✓ مشترٍ موثق
```

badge صغير بلون أخضر أسفل اسم المستخدم.

**ملاحظة:** الحقل `verifiedPurchase` موجود بالفعل في DB ومُمرَّر في الـ Review query — فقط يحتاج عرض.

---

## Phase 5 — تحديث Product Page للتمرير

**الملف:** `src/app/products/[id]/page.tsx`

### 5.1 إضافة الحقول الجديدة في الـ query

```ts
const product = await prisma.product.findUnique({
  where: { id },
  select: {
    // ... الموجودة
    unitLabel: true,
    unitSize: true,
    deliveryDays: true,
    maxOrderQty: true,
    specs: true,
    oemNumber: true,
  }
});
```

### 5.2 تمرير للـ components

```tsx
<ProductPurchasePanel
  // ... الموجودة
  unitLabel={product.unitLabel}
  unitSize={product.unitSize}
  deliveryDays={product.deliveryDays}
  maxOrderQty={product.maxOrderQty}
/>
```

وإضافة Specs Table فوق Reviews إذا `product.specs` ليست فارغة.

### 5.3 Specs Table Component (inline)

```
┌─────────────────────────────┐
│  مواصفات المنتج              │
├──────────────┬──────────────┤
│ التغطية     │ 10 م²/لتر    │
│ وقت الجفاف │ ساعتان       │
│ عدد الطبقات │ 2 طبقة       │
│ رقم الموديل │ JOT-JP-9L    │
└──────────────┴──────────────┘
```

---

## ترتيب التنفيذ

```
Phase 1 → db push (5 دقائق)
Phase 2 → Admin Form (45 دقيقة)
Phase 3 → Purchase Panel (45 دقيقة)
Phase 4 → Reviews (20 دقيقة)
Phase 5 → Product Page wiring (15 دقيقة)
```

**الإجمالي التقديري:** ~2.5 ساعة

---

## ما لا يحتاج admin control (global settings)

| الميزة | السبب |
|--------|-------|
| أيقونات الدفع | نفس لكل المنتجات — تُضاف مرة واحدة في الـ panel |
| زرار WhatsApp Share | نفس الـ URL لكل المنتجات |
| Copy Link | تلقائي من `window.location.href` |
| Rating Histogram | محسوب من reviews تلقائياً |
| Verified Purchase | محسوب من purchase history تلقائياً |

---

## ملاحظات التنفيذ

1. **`specs` كـ JSON string** — Parse بـ `try/catch` وإرجاع `[]` عند الفشل
2. **`maxOrderQty` default** — إذا كان `null` في DB، استخدام 99 في الـ UI
3. **Sticky bar** — يعرض الكمية المختارة (qty) وليس ثابتة 1
4. **TypeScript** — تحديث `createProductAction` و `updateProductAction` signatures
5. **Migration** — `db push` كافية بما أن SQLite في dev، لا تحتاج migration file
