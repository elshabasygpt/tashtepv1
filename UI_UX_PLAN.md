# خطة تحسينات UI/UX — تشطيب

> تاريخ التخطيط: 2026-06-28  
> الأولوية: من الأعلى تأثيراً على المبيعات للأدنى

---

## 🔴 حرجي — يأثر على المبيعات مباشرة

| # | المشكلة | الملف | الإصلاح | الحالة |
|---|---------|-------|---------|--------|
| 1 | Sort dropdown مكسور في البحث | `src/app/search/page.tsx` | استبدال الـ `<select onChange={undefined}>` بـ client wrapper يعمل router.push | ✅ |
| 2 | Cart empty state بدون CTA | `src/app/cart/page.tsx` | إضافة زرار "تصفح المنتجات" للـ EmptyState | ✅ |
| 3 | Account nav مش sticky | `src/app/account/layout.tsx` | إضافة `sticky top-0 bg-white z-10` | ✅ |
| 4 | Checkout inputs بدون labels | `src/features/checkout/components/checkout-form.tsx` | إضافة `<label>` فوق كل input | ✅ |
| 5 | Checkout بدون trust signals | `src/features/checkout/components/checkout-form.tsx` | إضافة بادجات دفع آمن / ضمان الإرجاع فوق الزرار | ✅ |

---

## 🟠 عالي — UX أساسي

| # | المشكلة | الملف | الإصلاح | الحالة |
|---|---------|-------|---------|--------|
| 6 | Blog detail بدون breadcrumb | `src/app/blog/[slug]/page.tsx` | إضافة breadcrumb nav أعلى المقال | ✅ |
| 7 | صور المنتج بدون zoom | `src/features/products/components/product-gallery.tsx` | إضافة lightbox dialog عند الضغط على الصورة | ✅ |
| 8 | Order success بدون ملخص | `src/app/order-success/[id]/page.tsx` | عرض المنتجات المطلوبة والسعر الإجمالي | ✅ |
| 9 | Wishlist بدون feedback | `src/features/products/components/product-card.tsx` | إضافة toast عند الإضافة/الإزالة | ✅ |

---

## تفاصيل التنفيذ

### 1. Search Sort Fix
- الـ `<select>` عنده `onChange={undefined}` — مكسور تماماً
- في الصفحة بالفعل Sort Pills كـ Links تشتغل
- الإصلاح: حذف الـ dropdown + تحسين Pills styling كـ primary UI

### 2. Cart Empty CTA  
- EmptyState موجودة لكن مفيش زرار تحتها
- إضافة `<Link href="/products">` زرار تشطيب

### 3. Account Nav Sticky
- الـ `<nav>` الـ horizontal في layout مش sticky
- بتتسحب مع الـ scroll على mobile

### 4. Checkout Labels
- كل inputs placeholder فقط — لما المستخدم يكتب بتختفي
- محتاج `<label>` فوق كل field

### 5. Trust Signals في Checkout
- المستخدم المصري محتاج ضمانات قبل ما يضغط تأكيد
- إضافة row صغيرة: دفع آمن | ضمان الإرجاع | توصيل لجميع المحافظات

### 6. Blog Breadcrumb
- صفحة المقال مفيش breadcrumb (بس فيه back button)
- إضافة `الرئيسية > المدونة > عنوان المقال` structured nav

### 7. Product Gallery Lightbox
- الصورة الرئيسية لا يمكن تكبيرها
- للمنتجات المنزلية: تفاصيل الملمس والجودة مهمة جداً
- إضافة dialog يفتح الصورة full-screen مع navigation بالسهم

### 8. Order Success Items
- الصفحة بتعرض رقم الطلب بس مش المنتجات
- الطلب مجبوب من الـ service مع items
- عرض جدول بسيط بالمنتجات والكميات والأسعار

### 9. Wishlist Toast
- الـ heart بيتغير instantly بدون feedback واضح
- إضافة `toast.success("أُضيف للمفضلة")` / `toast.info("أُزيل من المفضلة")`
