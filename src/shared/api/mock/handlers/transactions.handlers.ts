import { HttpResponse, http } from 'msw'
import { mockDb } from '../store/mockDb'

export const transactionsHandlers = [
  http.get('/v1/users/:id/transactions', ({ params, request }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const url = new URL(request.url)
    const limit = url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : undefined
    const offset = url.searchParams.has('offset')
      ? Number(url.searchParams.get('offset'))
      : undefined
    const from = url.searchParams.get('from') ?? undefined
    const to = url.searchParams.get('to') ?? undefined

    const result = mockDb.findTransactions(params.id as string, {
      limit,
      offset,
      from,
      to,
    })
    return HttpResponse.json(result)
  }),

  http.get('/v1/users/:id/transactions/:tx_id', ({ params }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const transaction = mockDb.findTransaction(params.id as string, params.tx_id as string)
    if (!transaction) {
      return HttpResponse.json({ message: 'Transaction not found' }, { status: 404 })
    }
    return HttpResponse.json({ transaction })
  }),
]
