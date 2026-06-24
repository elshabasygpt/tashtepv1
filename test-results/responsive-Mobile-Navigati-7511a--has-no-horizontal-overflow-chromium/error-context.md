# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> Mobile Navigation >> homepage has no horizontal overflow
- Location: e2e\responsive.spec.ts:23:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Tashtep Logo" [ref=e6] [cursor=pointer]:
          - /url: /
          - img "Tashtep Logo" [ref=e7]
        - generic [ref=e8]:
          - link "المفضلة" [ref=e9] [cursor=pointer]:
            - /url: /wishlist
            - generic [ref=e10]: favorite
          - link "تسجيل الدخول" [ref=e11] [cursor=pointer]:
            - /url: /login
            - generic [ref=e12]: person
          - link "عربة التسوق" [ref=e13] [cursor=pointer]:
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
            - link "استكشف المنتجات" [ref=e32] [cursor=pointer]:
              - /url: /products
            - link "احجز استشارة مجانية" [ref=e33] [cursor=pointer]:
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
                  - link "عن تشطيب" [ref=e53] [cursor=pointer]:
                    - /url: /about
                - listitem [ref=e54]:
                  - link "المشاريع" [ref=e55] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e56]:
                  - link "المدونة" [ref=e57] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e58]:
                  - link "العلامات التجارية" [ref=e59] [cursor=pointer]:
                    - /url: "#"
            - generic [ref=e60]:
              - heading "التسوق" [level=4] [ref=e61]
              - list [ref=e62]:
                - listitem [ref=e63]:
                  - link "الدهانات" [ref=e64] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e65]:
                  - link "التشطيبات" [ref=e66] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e67]:
                  - link "ورق الحائط" [ref=e68] [cursor=pointer]:
                    - /url: /products
                - listitem [ref=e69]:
                  - link "الأدوات" [ref=e70] [cursor=pointer]:
                    - /url: /products
            - generic [ref=e71]:
              - heading "خدمة العملاء" [level=4] [ref=e72]
              - list [ref=e73]:
                - listitem [ref=e74]:
                  - link "الشحن" [ref=e75] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e76]:
                  - link "الاسترجاع" [ref=e77] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e78]:
                  - link "الأسئلة الشائعة" [ref=e79] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e80]:
                  - link "تواصل معنا" [ref=e81] [cursor=pointer]:
                    - /url: /contact
          - generic [ref=e82]:
            - heading "اشترك للحصول على أحدث أفكار الديكور والعروض." [level=3] [ref=e83]
            - paragraph [ref=e84]: لن نرسل أكثر من رسالة أسبوعياً.
            - generic [ref=e85]:
              - textbox "بريدك الإلكتروني" [ref=e86]
              - button "اشتراك" [ref=e87] [cursor=pointer]
        - generic [ref=e88]:
          - link "Instagram" [ref=e89] [cursor=pointer]:
            - /url: "#"
            - img [ref=e90]
          - link "Facebook" [ref=e92] [cursor=pointer]:
            - /url: "#"
            - img [ref=e93]
          - link "LinkedIn" [ref=e95] [cursor=pointer]:
            - /url: "#"
            - img [ref=e96]
          - link "Pinterest" [ref=e98] [cursor=pointer]:
            - /url: "#"
            - img [ref=e99]
        - generic [ref=e102]:
          - paragraph [ref=e103]: © 2026 تشطيب. جميع الحقوق محفوظة.
          - generic [ref=e104]:
            - link "سياسة الخصوصية" [ref=e105] [cursor=pointer]:
              - /url: /privacy
            - link "الشروط والأحكام" [ref=e106] [cursor=pointer]:
              - /url: /terms
  - alert [ref=e107]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Run with --project="Mobile Chrome" / "Mobile Safari" to exercise real mobile viewports.
  4  | test.describe('Mobile Navigation', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.setViewportSize({ width: 390, height: 844 });
  7  |   });
  8  | 
  9  |   test('hamburger menu opens and navigates', async ({ page }) => {
  10 |     await page.goto('/');
  11 | 
  12 |     const menuButton = page.getByRole('button', { name: 'القائمة الرئيسية' });
  13 |     await expect(menuButton).toBeVisible();
  14 |     await menuButton.click();
  15 | 
  16 |     const productsLink = page.getByRole('link', { name: 'المنتجات', exact: true });
  17 |     await expect(productsLink).toBeVisible();
  18 |     await productsLink.click();
  19 | 
  20 |     await expect(page).toHaveURL(/.*\/products/);
  21 |   });
  22 | 
  23 |   test('homepage has no horizontal overflow', async ({ page }) => {
  24 |     await page.goto('/');
> 25 |     await page.waitForLoadState('networkidle');
     |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  26 | 
  27 |     const hasHorizontalOverflow = await page.evaluate(() => {
  28 |       return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  29 |     });
  30 | 
  31 |     expect(hasHorizontalOverflow).toBe(false);
  32 |   });
  33 | 
  34 |   test('tap targets in header meet minimum size', async ({ page }) => {
  35 |     await page.goto('/');
  36 |     const menuButton = page.getByRole('button', { name: 'القائمة الرئيسية' });
  37 |     const box = await menuButton.boundingBox();
  38 |     expect(box?.width).toBeGreaterThanOrEqual(40);
  39 |     expect(box?.height).toBeGreaterThanOrEqual(40);
  40 |   });
  41 | });
  42 | 
```