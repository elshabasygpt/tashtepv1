import { test, expect } from '@playwright/test';

test.describe('Enterprise E2E Coverage', () => {
  test('Guest checkout redirection', async ({ page }) => {
    // Navigate directly rather than via the nav link, since the desktop nav
    // is hidden on mobile viewports (covered separately by the responsive suite).
    await page.goto('/products');
    await expect(page).toHaveURL(/.*\/products/);

    // Wait for products to load and click the first product
    const productCard = page.locator('a[href^="/products/"]').first();
    await productCard.waitFor();
    await productCard.click();
    await page.waitForURL(/\/products\/.+/);

    // Click Add to Cart button
    const addToCartBtn = page.getByRole('button', { name: /أضف إلى السلة/i });
    await addToCartBtn.waitFor();

    // Not authenticated, adding to cart redirects to login
    await addToCartBtn.click();
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });

  test('Authentication Flow - Register and Login', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByPlaceholder('الاسم الكامل').fill('Test User');
    await page.getByPlaceholder('البريد الإلكتروني').fill(`test_${Date.now()}@example.com`);
    await page.getByPlaceholder('كلمة المرور', { exact: true }).fill('password123');
    await page.getByPlaceholder('تأكيد كلمة المرور').fill('password123');
    
    await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

    // Should navigate away from /register on success (e.g. to a verification page)
    await page.waitForURL((url) => !url.pathname.startsWith('/register'), { timeout: 15000 });
  });

  test('Search Flow', async ({ page }) => {
    await page.goto('/');
    // Desktop and mobile render separate search inputs (only one is visible per viewport)
    const searchInput = page.locator('input[name="q"]:visible').first();
    await searchInput.fill('سيراميك');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/.*\/products\?q=/);
  });
});
