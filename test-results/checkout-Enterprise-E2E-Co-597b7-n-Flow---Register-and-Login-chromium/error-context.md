# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Enterprise E2E Coverage >> Authentication Flow - Register and Login
- Location: e2e\checkout.spec.ts:25:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - link "Tashtep Logo" [ref=e6] [cursor=pointer]:
            - /url: /
            - img "Tashtep Logo" [ref=e7]
          - navigation [ref=e8]:
            - link "الرئيسية" [ref=e9] [cursor=pointer]:
              - /url: /
            - link "المنتجات expand_more" [ref=e11] [cursor=pointer]:
              - /url: /products
              - text: المنتجات
              - generic [ref=e12]: expand_more
            - link "الأقسام" [ref=e13] [cursor=pointer]:
              - /url: /categories
        - generic [ref=e16]:
          - generic:
            - generic: search
          - searchbox "ابحث عن دهان، معجون، ورق حائط، أداة أو ماركة..." [ref=e17]
        - generic [ref=e18]:
          - link "المفضلة" [ref=e19] [cursor=pointer]:
            - /url: /wishlist
            - generic [ref=e20]: favorite
          - link "تسجيل الدخول" [ref=e21] [cursor=pointer]:
            - /url: /login
            - generic [ref=e22]: person
          - link "عربة التسوق" [ref=e23] [cursor=pointer]:
            - /url: /cart
            - generic [ref=e24]: shopping_cart
            - generic [ref=e25]: "0"
    - main [ref=e26]:
      - generic [ref=e29]:
        - generic [ref=e30]:
          - heading "إنشاء حساب جديد" [level=3] [ref=e31]
          - paragraph [ref=e32]: انضم إلى Tashtep وتمتع بتجربة تسوق استثنائية
        - generic [ref=e34]:
          - generic [ref=e35]: "Invalid `prisma.user.findUnique()` invocation: Can't reach database server at `127.0.0.1:3307` Please make sure your database server is running at `127.0.0.1:3307`."
          - textbox "الاسم الكامل" [ref=e37]: Test User
          - textbox "البريد الإلكتروني" [ref=e39]: test_1782270508429@example.com
          - textbox "كلمة المرور" [ref=e41]: password123
          - textbox "تأكيد كلمة المرور" [ref=e43]: password123
          - button "إنشاء الحساب" [ref=e44] [cursor=pointer]
    - contentinfo [ref=e45]:
      - generic [ref=e46]:
        - generic [ref=e47]:
          - heading "كل مساحة تستحق لمسة استثنائية." [level=2] [ref=e48]
          - paragraph [ref=e49]: من اختيار اللون المناسب وحتى آخر تفاصيل التشطيب، نرافقك في كل خطوة لبناء مساحة تعكس ذوقك وتدوم لسنوات.
          - generic [ref=e50]:
            - link "استكشف المنتجات" [ref=e51] [cursor=pointer]:
              - /url: /products
            - link "احجز استشارة مجانية" [ref=e52] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]: 🚚
            - generic [ref=e56]: شحن لجميع المحافظات
          - generic [ref=e57]:
            - generic [ref=e58]: ⭐
            - generic [ref=e59]: منتجات أصلية 100%
          - generic [ref=e60]:
            - generic [ref=e61]: 📞
            - generic [ref=e62]: استشارة مجانية
          - generic [ref=e63]:
            - generic [ref=e64]: ↩️
            - generic [ref=e65]: استرجاع خلال 14 يوم
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - heading "الشركة" [level=4] [ref=e69]
              - list [ref=e70]:
                - listitem [ref=e71]:
                  - link "عن تشطيب" [ref=e72] [cursor=pointer]:
                    - /url: /about
                - listitem [ref=e73]:
                  - link "المشاريع" [ref=e74] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e75]:
                  - link "المدونة" [ref=e76] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e77]:
                  - link "العلامات التجارية" [ref=e78] [cursor=pointer]:
                    - /url: "#"
            - generic [ref=e79]:
              - heading "التسوق" [level=4] [ref=e80]
              - list [ref=e81]:
                - listitem [ref=e82]:
                  - link "الدهانات" [ref=e83] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e84]:
                  - link "التشطيبات" [ref=e85] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e86]:
                  - link "ورق الحائط" [ref=e87] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e88]:
                  - link "الأدوات" [ref=e89] [cursor=pointer]:
                    - /url: /products
            - generic [ref=e90]:
              - heading "خدمة العملاء" [level=4] [ref=e91]
              - list [ref=e92]:
                - listitem [ref=e93]:
                  - link "الشحن" [ref=e94] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e95]:
                  - link "الاسترجاع" [ref=e96] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e97]:
                  - link "الأسئلة الشائعة" [ref=e98] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e99]:
                  - link "تواصل معنا" [ref=e100] [cursor=pointer]:
                    - /url: /contact
          - generic [ref=e101]:
            - heading "اشترك للحصول على أحدث أفكار الديكور والعروض." [level=3] [ref=e102]
            - paragraph [ref=e103]: لن نرسل أكثر من رسالة أسبوعياً.
            - generic [ref=e104]:
              - textbox "بريدك الإلكتروني" [ref=e105]
              - button "اشتراك" [ref=e106] [cursor=pointer]
        - generic [ref=e107]:
          - link "Instagram" [ref=e108] [cursor=pointer]:
            - /url: "#"
            - img [ref=e109]
          - link "Facebook" [ref=e111] [cursor=pointer]:
            - /url: "#"
            - img [ref=e112]
          - link "LinkedIn" [ref=e114] [cursor=pointer]:
            - /url: "#"
            - img [ref=e115]
          - link "Pinterest" [ref=e117] [cursor=pointer]:
            - /url: "#"
            - img [ref=e118]
        - generic [ref=e121]:
          - paragraph [ref=e122]: © 2026 تشطيب. جميع الحقوق محفوظة.
          - generic [ref=e123]:
            - link "سياسة الخصوصية" [ref=e124] [cursor=pointer]:
              - /url: /privacy
            - link "الشروط والأحكام" [ref=e125] [cursor=pointer]:
              - /url: /terms
  - alert [ref=e126]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Enterprise E2E Coverage', () => {
  4  |   test('Guest checkout redirection', async ({ page }) => {
  5  |     // Navigate directly rather than via the nav link, since the desktop nav
  6  |     // is hidden on mobile viewports (covered separately by the responsive suite).
  7  |     await page.goto('/products');
  8  |     await expect(page).toHaveURL(/.*\/products/);
  9  | 
  10 |     // Wait for products to load and click the first product
  11 |     const productCard = page.locator('a[href^="/products/"]').first();
  12 |     await productCard.waitFor();
  13 |     await productCard.click();
  14 |     await page.waitForURL(/\/products\/.+/);
  15 | 
  16 |     // Click Add to Cart button
  17 |     const addToCartBtn = page.getByRole('button', { name: /أضف إلى السلة/i });
  18 |     await addToCartBtn.waitFor();
  19 | 
  20 |     // Not authenticated, adding to cart redirects to login
  21 |     await addToCartBtn.click();
  22 |     await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  23 |   });
  24 | 
  25 |   test('Authentication Flow - Register and Login', async ({ page }) => {
  26 |     await page.goto('/register');
  27 |     
  28 |     await page.getByPlaceholder('الاسم الكامل').fill('Test User');
  29 |     await page.getByPlaceholder('البريد الإلكتروني').fill(`test_${Date.now()}@example.com`);
  30 |     await page.getByPlaceholder('كلمة المرور', { exact: true }).fill('password123');
  31 |     await page.getByPlaceholder('تأكيد كلمة المرور').fill('password123');
  32 |     
  33 |     await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
  34 | 
  35 |     // Should navigate away from /register on success (e.g. to a verification page)
> 36 |     await page.waitForURL((url) => !url.pathname.startsWith('/register'), { timeout: 15000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  37 |   });
  38 | 
  39 |   test('Search Flow', async ({ page }) => {
  40 |     await page.goto('/');
  41 |     // Desktop and mobile render separate search inputs (only one is visible per viewport)
  42 |     const searchInput = page.locator('input[name="q"]:visible').first();
  43 |     await searchInput.fill('سيراميك');
  44 |     await searchInput.press('Enter');
  45 | 
  46 |     await expect(page).toHaveURL(/.*\/products\?q=/);
  47 |   });
  48 | });
  49 | 
```