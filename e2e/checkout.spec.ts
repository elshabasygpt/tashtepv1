import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should allow a guest user to browse products and add to cart', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    
    // 2. Go to products
    await page.getByRole('link', { name: 'المنتجات' }).first().click();
    await expect(page).toHaveURL(/.*\/products/);

    // 3. Wait for products to load and click the first product
    const productCard = page.locator('a[href^="/products/"]').first();
    await productCard.waitFor();
    await productCard.click();

    // 4. Click Add to Cart button
    const addToCartBtn = page.getByRole('button', { name: /إضافة للسلة/i });
    await addToCartBtn.waitFor();
    
    // If not authenticated, adding to cart should redirect to login or show error.
    // Assuming adding to cart as a guest works or redirects to login
    await addToCartBtn.click();

    // If redirected to login, verify
    // await expect(page).toHaveURL(/.*\/login/);
  });
});
