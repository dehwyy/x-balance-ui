import { test, expect } from '@playwright/test'

test.describe('Users list page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('redirects to /users from root', async ({ page }) => {
    await expect(page).toHaveURL(/\/users/)
  })

  test('shows list of users from mock data', async ({ page }) => {
    await page.goto('/users')
    // Wait for at least one user row to appear
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible({ timeout: 10000 })
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('navigates to user detail page on row click', async ({ page }) => {
    await page.goto('/users')
    const rows = page.locator('table tbody tr')
    await rows.first().waitFor({ timeout: 10000 })
    await rows.first().click()
    await expect(page).toHaveURL(/\/users\/[a-f0-9-]+/)
  })
})
