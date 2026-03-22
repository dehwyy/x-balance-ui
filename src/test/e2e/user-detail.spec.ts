import { test, expect } from '@playwright/test'

const USER_1_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const USER_1_NAME = 'Алексей Петров'

test.describe('User detail page', () => {
  test('shows user name and balance', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)
    // User name should appear in heading (not skeleton)
    await expect(page.locator('h1')).toContainText(USER_1_NAME, { timeout: 15000 })
    // Balance section should be visible
    await expect(page.getByText(/available/i).or(page.getByText(/Available/))).toBeVisible({
      timeout: 10000,
    })
  })

  test('shows transactions table with data', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)
    // Wait for heading to confirm page loaded
    await expect(page.locator('h1')).toContainText(USER_1_NAME, { timeout: 15000 })
    // Transactions table body should have real rows (not skeleton): look for a type badge
    await expect(page.locator('[data-slot="badge"]').first().or(
      page.getByText(/Credit|Debit|Freeze|Unfreeze/)
    )).toBeVisible({ timeout: 10000 })
  })

  test('opens transaction detail sheet on row click', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)
    await expect(page.locator('h1')).toContainText(USER_1_NAME, { timeout: 15000 })
    // Wait for real transaction rows (has a credit/debit amount with + or -)
    await page.getByText(/Credit|Debit|Freeze/).first().waitFor({ timeout: 10000 })
    // Click the first transaction row
    await page.locator('table tbody tr').first().click()
    // Sheet/dialog should open
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })
  })

  test('back button returns to users list', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)
    await expect(page.locator('h1')).toContainText(USER_1_NAME, { timeout: 15000 })
    await page.getByRole('button', { name: /back/i }).click()
    await expect(page).toHaveURL(/\/users$/, { timeout: 5000 })
  })
})
