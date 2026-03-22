import { test, expect } from '@playwright/test'

const USER_1_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

test.describe('User detail page', () => {
  test('shows user name and balance', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)

    // User name should appear in heading
    await expect(page.locator('h1')).toContainText('Алексей Петров', { timeout: 10000 })

    // Balance card should show numbers
    await expect(page.getByText('Available').or(page.getByText('available'))).toBeVisible({
      timeout: 10000,
    })
  })

  test('shows transactions table', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)

    // Wait for transactions to load
    const txRows = page.locator('table tbody tr')
    await txRows.first().waitFor({ timeout: 10000 })
    const count = await txRows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('opens transaction detail sheet on row click', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)

    const txRows = page.locator('table tbody tr')
    await txRows.first().waitFor({ timeout: 10000 })
    await txRows.first().click()

    // Sheet should open
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })
  })

  test('back button returns to users list', async ({ page }) => {
    await page.goto(`/users/${USER_1_ID}`)
    await page.locator('h1').waitFor({ timeout: 10000 })

    await page.getByRole('button', { name: /back/i }).click()
    await expect(page).toHaveURL(/\/users$/)
  })
})
