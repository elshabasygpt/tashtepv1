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
        - link "Tashtep Logo" [ref=e6]:
          - /url: /
          - img "Tashtep Logo" [ref=e7]
        - generic [ref=e8]:
          - link "المفضلة" [ref=e9]:
            - /url: /wishlist
            - generic [ref=e10]: favorite
          - link "تسجيل الدخول" [ref=e11]:
            - /url: /login
            - generic [ref=e12]: person
          - link "عربة التسوق" [ref=e13]:
            - /url: /cart
            - generic [ref=e14]: shopping_cart
            - generic [ref=e15]: "0"
          - button "القائمة الرئيسية" [ref=e16] [cursor=pointer]:
            - generic [ref=e17]: menu
      - generic [ref=e19]:
        - generic:
          - generic: search
        - searchbox "ابحث..." [ref=e20]
    - main [ref=e21]:
      - generic [ref=e22]:
        - heading "حدث خطأ غير متوقع" [level=2] [ref=e23]
        - paragraph [ref=e24]: نعتذر عن هذا الخلل. فريقنا الهندسي يعمل على مراقبة أداء المنصة وتحسينه باستمرار.
        - button "المحاولة مرة أخرى" [ref=e25] [cursor=pointer]
    - contentinfo [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - heading "كل مساحة تستحق لمسة استثنائية." [level=2] [ref=e29]
          - paragraph [ref=e30]: من اختيار اللون المناسب وحتى آخر تفاصيل التشطيب، نرافقك في كل خطوة لبناء مساحة تعكس ذوقك وتدوم لسنوات.
          - generic [ref=e31]:
            - link "استكشف المنتجات" [ref=e32]:
              - /url: /products
            - link "احجز استشارة مجانية" [ref=e33]:
              - /url: /contact
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]: 🚚
            - generic [ref=e37]: شحن لجميع المحافظات
          - generic [ref=e38]:
            - generic [ref=e39]: ⭐
            - generic [ref=e40]: منتجات أصلية 100%
          - generic [ref=e41]:
            - generic [ref=e42]: 📞
            - generic [ref=e43]: استشارة مجانية
          - generic [ref=e44]:
            - generic [ref=e45]: ↩️
            - generic [ref=e46]: استرجاع خلال 14 يوم
        - generic [ref=e47]:
          - generic [ref=e48]:
            - generic [ref=e49]:
              - heading "الشركة" [level=4] [ref=e50]
              - list [ref=e51]:
                - listitem [ref=e52]:
                  - link "عن تشطيب" [ref=e53]:
                    - /url: /about
                - listitem [ref=e54]:
                  - link "المشاريع" [ref=e55]:
                    - /url: "#"
                - listitem [ref=e56]:
                  - link "المدونة" [ref=e57]:
                    - /url: "#"
                - listitem [ref=e58]:
                  - link "العلامات التجارية" [ref=e59]:
                    - /url: "#"
            - generic [ref=e60]:
              - heading "التسوق" [level=4] [ref=e61]
              - list [ref=e62]:
                - listitem [ref=e63]:
                  - link "الدهانات" [ref=e64]:
                    - /url: /products
                - listitem [ref=e65]:
                  - link "التشطيبات" [ref=e66]:
                    - /url: /products
                - listitem [ref=e67]:
                  - link "ورق الحائط" [ref=e68]:
                    - /url: /products
                - listitem [ref=e69]:
                  - link "الأدوات" [ref=e70]:
                    - /url: /products
            - generic [ref=e71]:
              - heading "خدمة العملاء" [level=4] [ref=e72]
              - list [ref=e73]:
                - listitem [ref=e74]:
                  - link "الشحن" [ref=e75]:
                    - /url: "#"
                - listitem [ref=e76]:
                  - link "الاسترجاع" [ref=e77]:
                    - /url: "#"
                - listitem [ref=e78]:
                  - link "الأسئلة الشائعة" [ref=e79]:
                    - /url: "#"
                - listitem [ref=e80]:
                  - link "تواصل معنا" [ref=e81]:
                    - /url: /contact
          - generic [ref=e82]:
            - heading "اشترك للحصول على أحدث أفكار الديكور والعروض." [level=3] [ref=e83]
            - paragraph [ref=e84]: لن نرسل أكثر من رسالة أسبوعياً.
            - generic [ref=e85]:
              - textbox "بريدك الإلكتروني" [ref=e86]
              - button "اشتراك" [ref=e87] [cursor=pointer]
        - generic [ref=e88]:
          - link "Instagram" [ref=e89]:
            - /url: "#"
            - img [ref=e90]
          - link "Facebook" [ref=e92]:
            - /url: "#"
            - img [ref=e93]
          - link "LinkedIn" [ref=e95]:
            - /url: "#"
            - img [ref=e96]
          - link "Pinterest" [ref=e98]:
            - /url: "#"
            - img [ref=e99]
        - generic [ref=e102]:
          - paragraph [ref=e103]: © 2026 تشطيب. جميع الحقوق محفوظة.
          - generic [ref=e104]:
            - link "سياسة الخصوصية" [ref=e105]:
              - /url: /privacy
            - link "الشروط والأحكام" [ref=e106]:
              - /url: /terms
  - alert [ref=e107]
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