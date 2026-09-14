import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('shows the public foundation shell', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Friends of Recreation/)
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeAttached()
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })
})
