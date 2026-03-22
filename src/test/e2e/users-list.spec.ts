import { test, expect } from '@playwright/test'

// User names from mock seed data
const SEED_USER_NAME = 'Алексей Петров'

test.describe('Users list page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('redirects to /users from root', async ({ page }) => {
    await expect(page).toHaveURL(/\/users/, { timeout: 10000 })
  })

  test('shows list of users from mock data', async ({ page }) => {
    await page.goto('/users')
    // Wait for real data row (contains a user name, not just a skeleton)
    await expect(page.getByText(SEED_USER_NAME)).toBeVisible({ timeout: 15000 })
  })

  test('navigates to user detail page on row click', async ({ page }) => {
    await page.goto('/users')
    // Wait for actual data to load
    await expect(page.getByText(SEED_USER_NAME)).toBeVisible({ timeout: 15000 })
    // Click the row that contains the user name
    await page.getByText(SEED_USER_NAME).click()
    await expect(page).toHaveURL(/\/users\/[a-f0-9-]+/, { timeout: 5000 })
  })
})
