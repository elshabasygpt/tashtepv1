import { test, expect } from '@playwright/test';

test.describe('Enterprise E2E Coverage', () => {
  test('Guest checkout - add to cart without an account', async ({ page }) => {
    // Navigate directly rather than via the nav link, since the desktop nav
    // is hidden on mobile viewports (covered separately by the responsive suite).
    await page.goto('/products');
    await expect(page).toHaveURL(/.*\/products/);

    // Wait for products to load and click the first product
    const productCard = page.locator('a[href^="/products/"]').first();
    await productCard.waitFor();
    // Click the top area to avoid hitting the "Quick Add" button overlay on hover
    await productCard.click({ position: { x: 10, y: 10 } });
    await page.waitForURL(/\/products\/.+/);

    // Click Add to Cart button
    const addToCartBtn = page.getByRole('button', { name: /أضف.*لسلة/i }).first();
    await addToCartBtn.waitFor();

    // Guests can add to cart without being redirected to login.
    await addToCartBtn.click();
    await expect(page.getByText('تمت الإضافة إلى السلة بنجاح')).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/.*\/login/);

    // The item should persist in the guest (localStorage) cart.
    await page.goto('/cart');
    await expect(page.getByText('السلة فارغة')).not.toBeVisible();
  });

  test('Authentication Flow - Register and Login', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByPlaceholder('الاسم الكامل').fill('Test User');
    await page.getByPlaceholder('البريد الإلكتروني').fill(`test_${Date.now()}@example.com`);
    await page.getByPlaceholder('كلمة المرور', { exact: true }).fill('password123');
    await page.getByPlaceholder('تأكيد كلمة المرور').fill('password123');
    
    await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

    // Should navigate to /login on success
    await page.waitForURL(/\/login.*/, { timeout: 20000 });
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
