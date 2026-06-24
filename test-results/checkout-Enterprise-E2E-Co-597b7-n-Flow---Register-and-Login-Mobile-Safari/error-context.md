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
      - generic [ref=e24]:
        - generic [ref=e25]:
          - heading "إنشاء حساب جديد" [level=3] [ref=e26]
          - paragraph [ref=e27]: انضم إلى Tashtep وتمتع بتجربة تسوق استثنائية
        - generic [ref=e29]:
          - generic [ref=e30]: عذراً، تجاوزت الحد المسموح به من المحاولات. يرجى المحاولة بعد قليل.
          - textbox "الاسم الكامل" [ref=e32]: Test User
          - textbox "البريد الإلكتروني" [ref=e34]: test_1782270562422@example.com
          - textbox "كلمة المرور" [ref=e36]: password123
          - textbox "تأكيد كلمة المرور" [ref=e38]: password123
          - button "إنشاء الحساب" [ref=e39] [cursor=pointer]
    - contentinfo [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - heading "كل مساحة تستحق لمسة استثنائية." [level=2] [ref=e43]
          - paragraph [ref=e44]: من اختيار اللون المناسب وحتى آخر تفاصيل التشطيب، نرافقك في كل خطوة لبناء مساحة تعكس ذوقك وتدوم لسنوات.
          - generic [ref=e45]:
            - link "استكشف المنتجات" [ref=e46]:
              - /url: /products
            - link "احجز استشارة مجانية" [ref=e47]:
              - /url: /contact
        - generic [ref=e48]:
          - generic [ref=e49]:
            - generic [ref=e50]: 🚚
            - generic [ref=e51]: شحن لجميع المحافظات
          - generic [ref=e52]:
            - generic [ref=e53]: ⭐
            - generic [ref=e54]: منتجات أصلية 100%
          - generic [ref=e55]:
            - generic [ref=e56]: 📞
            - generic [ref=e57]: استشارة مجانية
          - generic [ref=e58]:
            - generic [ref=e59]: ↩️
            - generic [ref=e60]: استرجاع خلال 14 يوم
        - generic [ref=e61]:
          - generic [ref=e62]:
            - generic [ref=e63]:
              - heading "الشركة" [level=4] [ref=e64]
              - list [ref=e65]:
                - listitem [ref=e66]:
                  - link "عن تشطيب" [ref=e67]:
                    - /url: /about
                - listitem [ref=e68]:
                  - link "المشاريع" [ref=e69]:
                    - /url: "#"
                - listitem [ref=e70]:
                  - link "المدونة" [ref=e71]:
                    - /url: "#"
                - listitem [ref=e72]:
                  - link "العلامات التجارية" [ref=e73]:
                    - /url: "#"
            - generic [ref=e74]:
              - heading "التسوق" [level=4] [ref=e75]
              - list [ref=e76]:
                - listitem [ref=e77]:
                  - link "الدهانات" [ref=e78]:
                    - /url: /products
                - listitem [ref=e79]:
                  - link "التشطيبات" [ref=e80]:
                    - /url: /products
                - listitem [ref=e81]:
                  - link "ورق الحائط" [ref=e82]:
                    - /url: /products
                - listitem [ref=e83]:
                  - link "الأدوات" [ref=e84]:
                    - /url: /products
            - generic [ref=e85]:
              - heading "خدمة العملاء" [level=4] [ref=e86]
              - list [ref=e87]:
                - listitem [ref=e88]:
                  - link "الشحن" [ref=e89]:
                    - /url: "#"
                - listitem [ref=e90]:
                  - link "الاسترجاع" [ref=e91]:
                    - /url: "#"
                - listitem [ref=e92]:
                  - link "الأسئلة الشائعة" [ref=e93]:
                    - /url: "#"
                - listitem [ref=e94]:
                  - link "تواصل معنا" [ref=e95]:
                    - /url: /contact
          - generic [ref=e96]:
            - heading "اشترك للحصول على أحدث أفكار الديكور والعروض." [level=3] [ref=e97]
            - paragraph [ref=e98]: لن نرسل أكثر من رسالة أسبوعياً.
            - generic [ref=e99]:
              - textbox "بريدك الإلكتروني" [ref=e100]
              - button "اشتراك" [ref=e101] [cursor=pointer]
        - generic [ref=e102]:
          - link "Instagram" [ref=e103]:
            - /url: "#"
            - img [ref=e104]
          - link "Facebook" [ref=e106]:
            - /url: "#"
            - img [ref=e107]
          - link "LinkedIn" [ref=e109]:
            - /url: "#"
            - img [ref=e110]
          - link "Pinterest" [ref=e112]:
            - /url: "#"
            - img [ref=e113]
        - generic [ref=e116]:
          - paragraph [ref=e117]: © 2026 تشطيب. جميع الحقوق محفوظة.
          - generic [ref=e118]:
            - link "سياسة الخصوصية" [ref=e119]:
              - /url: /privacy
            - link "الشروط والأحكام" [ref=e120]:
              - /url: /terms
  - alert [ref=e121]
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