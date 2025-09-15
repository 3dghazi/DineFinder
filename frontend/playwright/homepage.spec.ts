import { test, expect } from '@playwright/test';

test('homepage loads and displays header', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('header')).toContainText('DineFinder');
});

test('each restaurant item displays title', async ({ page }) => {
  await page.goto('http://localhost:3001');
  const cards = page.locator('[data-testid="restaurant-card-title"]');
  await expect(cards.first()).toBeVisible();
});

test('filter sidebar controls are visible and interactive', async ({ page }) => {
  await page.goto('http://localhost:3001');
  const searchInput = page.locator('[data-testid="search-input"]');
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await searchInput.click();

  const priceToggle = page.getByLabel('Filter by Price');
  await expect(priceToggle).toBeVisible();
  await priceToggle.click();

  const openNowCheckbox = page.getByLabel('Open Now');
  await expect(openNowCheckbox).toBeVisible();
  await openNowCheckbox.click();
});

test('restaurant detail page displays info and navigation', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.evaluate(() => {
    window.open = (url) => {
      if (typeof url === 'string') {
        window.location.href = url;
      }
      return null;
    };
  });
  const firstCard = page.locator('[data-testid="restaurant-card-title"]').first();
  const title = await firstCard.textContent();
  await firstCard.click();
  await expect(page).toHaveURL(/\/restaurant\//);
  await expect(page.locator('[data-testid="restaurant-name"]')).toContainText(title || '');
  const openChip = page.locator('text=Open Now');
  const closedChip = page.locator('text=Closed');
  const isOpenVisible = await openChip.isVisible().catch(() => false);
  const isClosedVisible = await closedChip.isVisible().catch(() => false);
  expect(isOpenVisible || isClosedVisible).toBe(true);
});
