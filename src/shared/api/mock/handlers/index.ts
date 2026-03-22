import { balanceHandlers } from './balance.handlers'
import { transactionsHandlers } from './transactions.handlers'
import { usersHandlers } from './users.handlers'

export const handlers = [...usersHandlers, ...balanceHandlers, ...transactionsHandlers]
