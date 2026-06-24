import { test, expect } from '@playwright/test';

// Run with --project="Mobile Chrome" / "Mobile Safari" to exercise real mobile viewports.
test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('hamburger menu opens and navigates', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: 'القائمة الرئيسية' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const productsLink = page.getByRole('link', { name: 'المنتجات', exact: true });
    await expect(productsLink).toBeVisible();
    await productsLink.click();

    await expect(page).toHaveURL(/.*\/products/);
  });

  test('homepage has no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { level: 1 }).waitFor();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test('tap targets in header meet minimum size', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: 'القائمة الرئيسية' });
    const box = await menuButton.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(40);
    expect(box?.height).toBeGreaterThanOrEqual(40);
  });
});
