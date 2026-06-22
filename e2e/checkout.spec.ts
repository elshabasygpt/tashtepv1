import { test, expect } from '@playwright/test';

test.describe('Enterprise E2E Coverage', () => {
  test('Guest checkout redirection', async ({ page }) => {
    await page.goto('/');
    
    // Go to products
    await page.getByRole('link', { name: 'المنتجات' }).first().click();
    await expect(page).toHaveURL(/.*\/products/);

    // Wait for products to load and click the first product
    const productCard = page.locator('a[href^="/products/"]').first();
    await productCard.waitFor();
    await productCard.click();

    // Click Add to Cart button
    const addToCartBtn = page.getByRole('button', { name: /إضافة للسلة/i });
    await addToCartBtn.waitFor();
    
    // Not authenticated, adding to cart redirects to login
    await addToCartBtn.click();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Authentication Flow - Register and Login', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByPlaceholder('الاسم الكامل').fill('Test User');
    await page.getByPlaceholder('البريد الإلكتروني').fill(`test_${Date.now()}@example.com`);
    await page.getByPlaceholder('كلمة المرور').fill('password123');
    await page.getByPlaceholder('تأكيد كلمة المرور').fill('password123');
    
    await page.getByRole('button', { name: 'إنشاء حساب' }).click();
    
    // Should go to verification page or show success
    // Wait for network idle or URL change
    await page.waitForLoadState('networkidle');
  });

  test('Search Flow', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder('ابحث عن منتجات، ألوان، أو مواد بناء...');
    await searchInput.fill('سيراميك');
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL(/.*\/products\?q=/);
  });
});
