export function formatAmount(amount: string, currency = '₽'): string {
  const parsed = parseFloat(amount)
  if (Number.isNaN(parsed)) return `0.00 ${currency}`

  const formatted = Math.abs(parsed).toFixed(2)
  const sign = parsed < 0 ? '−' : ''
  return `${sign}${formatted} ${currency}`
}

export function isNegative(amount: string): boolean {
  return parseFloat(amount) < 0
}
