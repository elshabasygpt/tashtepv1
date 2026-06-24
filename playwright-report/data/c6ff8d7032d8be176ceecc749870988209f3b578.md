# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Enterprise E2E Coverage >> Guest checkout redirection
- Location: e2e\checkout.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a[href^="/products/"]').first() to be visible

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
      - generic [ref=e27]:
        - heading "حدث خطأ غير متوقع" [level=2] [ref=e28]
        - paragraph [ref=e29]: نعتذر عن هذا الخلل. فريقنا الهندسي يعمل على مراقبة أداء المنصة وتحسينه باستمرار.
        - button "المحاولة مرة أخرى" [ref=e30] [cursor=pointer]
    - contentinfo [ref=e31]:
      - generic [ref=e32]:
        - generic [ref=e33]:
          - heading "كل مساحة تستحق لمسة استثنائية." [level=2] [ref=e34]
          - paragraph [ref=e35]: من اختيار اللون المناسب وحتى آخر تفاصيل التشطيب، نرافقك في كل خطوة لبناء مساحة تعكس ذوقك وتدوم لسنوات.
          - generic [ref=e36]:
            - link "استكشف المنتجات" [ref=e37] [cursor=pointer]:
              - /url: /products
            - link "احجز استشارة مجانية" [ref=e38] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e39]:
          - generic [ref=e40]:
            - generic [ref=e41]: 🚚
            - generic [ref=e42]: شحن لجميع المحافظات
          - generic [ref=e43]:
            - generic [ref=e44]: ⭐
            - generic [ref=e45]: منتجات أصلية 100%
          - generic [ref=e46]:
            - generic [ref=e47]: 📞
            - generic [ref=e48]: استشارة مجانية
          - generic [ref=e49]:
            - generic [ref=e50]: ↩️
            - generic [ref=e51]: استرجاع خلال 14 يوم
        - generic [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]:
              - heading "الشركة" [level=4] [ref=e55]
              - list [ref=e56]:
                - listitem [ref=e57]:
                  - link "عن تشطيب" [ref=e58] [cursor=pointer]:
                    - /url: /about
                - listitem [ref=e59]:
                  - link "المشاريع" [ref=e60] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e61]:
                  - link "المدونة" [ref=e62] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e63]:
                  - link "العلامات التجارية" [ref=e64] [cursor=pointer]:
                    - /url: "#"
            - generic [ref=e65]:
              - heading "التسوق" [level=4] [ref=e66]
              - list [ref=e67]:
                - listitem [ref=e68]:
                  - link "الدهانات" [ref=e69] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e70]:
                  - link "التشطيبات" [ref=e71] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e72]:
                  - link "ورق الحائط" [ref=e73] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e74]:
                  - link "الأدوات" [ref=e75] [cursor=pointer]:
                    - /url: /products
            - generic [ref=e76]:
              - heading "خدمة العملاء" [level=4] [ref=e77]
              - list [ref=e78]:
                - listitem [ref=e79]:
                  - link "الشحن" [ref=e80] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e81]:
                  - link "الاسترجاع" [ref=e82] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e83]:
                  - link "الأسئلة الشائعة" [ref=e84] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e85]:
                  - link "تواصل معنا" [ref=e86] [cursor=pointer]:
                    - /url: /contact
          - generic [ref=e87]:
            - heading "اشترك للحصول على أحدث أفكار الديكور والعروض." [level=3] [ref=e88]
            - paragraph [ref=e89]: لن نرسل أكثر من رسالة أسبوعياً.
            - generic [ref=e90]:
              - textbox "بريدك الإلكتروني" [ref=e91]
              - button "اشتراك" [ref=e92] [cursor=pointer]
        - generic [ref=e93]:
          - link "Instagram" [ref=e94] [cursor=pointer]:
            - /url: "#"
            - img [ref=e95]
          - link "Facebook" [ref=e97] [cursor=pointer]:
            - /url: "#"
            - img [ref=e98]
          - link "LinkedIn" [ref=e100] [cursor=pointer]:
            - /url: "#"
            - img [ref=e101]
          - link "Pinterest" [ref=e103] [cursor=pointer]:
            - /url: "#"
            - img [ref=e104]
        - generic [ref=e107]:
          - paragraph [ref=e108]: © 2026 تشطيب. جميع الحقوق محفوظة.
          - generic [ref=e109]:
            - link "سياسة الخصوصية" [ref=e110] [cursor=pointer]:
              - /url: /privacy
            - link "الشروط والأحكام" [ref=e111] [cursor=pointer]:
              - /url: /terms
  - alert [ref=e112]
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
> 12 |     await productCard.waitFor();
     |                       ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
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
  36 |     await page.waitForURL((url) => !url.pathname.startsWith('/register'), { timeout: 15000 });
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