<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Transaction, TransactionType } from '@/entities/transaction'
import { TransactionTypeBadge, TX_TYPE_LABELS } from '@/entities/transaction'
import { useGetTransaction, useListTransactions } from '@/shared/api/hooks'
import { DatePicker } from '@/shared/ui'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const { t } = useI18n()

const LIMIT = 20

const page = ref(1)
const fromDate = ref('')
const toDate = ref('')

const userIdRef = computed(() => props.userId)

const params = computed(() => ({
  limit: LIMIT,
  offset: (page.value - 1) * LIMIT,
  ...(fromDate.value ? { from: `${fromDate.value}T00:00:00Z` } : {}),
  ...(toDate.value ? { to: `${toDate.value}T23:59:59Z` } : {}),
}))

const { data, isLoading } = useListTransactions(userIdRef, params)

const transactions = computed(() => data.value?.transactions ?? [])
const total = computed(() => Number(data.value?.total ?? 0))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / LIMIT)))

watch([fromDate, toDate], () => {
  page.value = 1
})

const selectedTxId = ref('')
const sheetOpen = ref(false)

const { data: txDetail, isLoading: txDetailLoading } = useGetTransaction(userIdRef, selectedTxId)

function openTxDetail(tx: Transaction) {
  selectedTxId.value = tx.id
  sheetOpen.value = true
}

function closeSheet() {
  sheetOpen.value = false
  selectedTxId.value = ''
}

const POSITIVE_TYPES: TransactionType[] = [
  'TRANSACTION_TYPE_CREDIT',
  'TRANSACTION_TYPE_FREEZE_RELEASE',
]
const NEGATIVE_TYPES: TransactionType[] = ['TRANSACTION_TYPE_DEBIT', 'TRANSACTION_TYPE_FREEZE_HOLD']

function amountClass(type: TransactionType): string {
  if (POSITIVE_TYPES.includes(type)) return 'text-green-500 tabular-nums'
  if (NEGATIVE_TYPES.includes(type)) return 'text-destructive tabular-nums'
  return 'tabular-nums'
}

function amountPrefix(type: TransactionType): string {
  if (POSITIVE_TYPES.includes(type)) return '+'
  if (NEGATIVE_TYPES.includes(type)) return '-'
  return ''
}

function truncateTxId(id: string): string {
  if (id.length <= 12) return id
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-end gap-4">
      <div class="flex flex-col gap-1">
        <Label class="text-xs text-muted-foreground">{{ t('transactions.from') }}</Label>
        <DatePicker v-model="fromDate" :placeholder="t('common.startDate')" />
      </div>
      <div class="flex flex-col gap-1">
        <Label class="text-xs text-muted-foreground">{{ t('transactions.to') }}</Label>
        <DatePicker v-model="toDate" :placeholder="t('common.endDate')" />
      </div>
      <Button
        v-if="fromDate || toDate"
        variant="ghost"
        size="sm"
        class="text-muted-foreground hover:text-foreground"
        @click="fromDate = ''; toDate = ''"
      >
        Clear filters
      </Button>
    </div>

    <div class="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ t('transactions.type') }}</TableHead>
            <TableHead>{{ t('transactions.amount') }}</TableHead>
            <TableHead class="hidden md:table-cell">{{ t('transactions.transactionId') }}</TableHead>
            <TableHead class="hidden sm:table-cell">{{ t('transactions.createdAt') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-auto-animate>
          <template v-if="isLoading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell><Skeleton class="h-5 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-20" /></TableCell>
              <TableCell class="hidden md:table-cell"><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell class="hidden sm:table-cell"><Skeleton class="h-4 w-36" /></TableCell>
            </TableRow>
          </template>

          <template v-else-if="transactions.length === 0">
            <TableRow>
              <TableCell colspan="4" class="text-center py-10 text-muted-foreground">
                No transactions found.
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow
              v-for="tx in transactions"
              :key="tx.id"
              class="cursor-pointer hover:bg-muted/50 transition-colors"
              @click="openTxDetail(tx)"
            >
              <TableCell>
                <TransactionTypeBadge :type="tx.type" />
              </TableCell>
              <TableCell :class="amountClass(tx.type)">
                {{ amountPrefix(tx.type) }}{{ tx.amount }}
              </TableCell>
              <TableCell class="hidden md:table-cell">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span class="font-mono text-xs text-muted-foreground cursor-default">
                        {{ truncateTxId(tx.transactionId) }}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p class="font-mono text-xs">{{ tx.transactionId }}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell class="hidden sm:table-cell text-muted-foreground text-sm">
                {{ formatDate(tx.createdAt) }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-sm text-muted-foreground">
        Page {{ page }} of {{ totalPages }}
        <span v-if="total > 0" class="ml-1">({{ total }} total)</span>
      </span>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8 focus-visible:ring-2 focus-visible:ring-ring"
          :disabled="page <= 1 || isLoading"
          aria-label="Previous page"
          @click="page--"
        >
          <ChevronLeft :size="14" :stroke-width="1.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8 focus-visible:ring-2 focus-visible:ring-ring"
          :disabled="page >= totalPages || isLoading"
          aria-label="Next page"
          @click="page++"
        >
          <ChevronRight :size="14" :stroke-width="1.5" />
        </Button>
      </div>
    </div>
  </div>

  <Sheet :open="sheetOpen" @update:open="closeSheet">
    <SheetContent class="w-full sm:max-w-md overflow-y-auto p-0">
      <SheetHeader class="px-6 pt-6 pb-4">
        <SheetTitle class="text-base">{{ t('transactions.details') }}</SheetTitle>
      </SheetHeader>

      <template v-if="txDetailLoading">
        <div class="flex flex-col gap-3 px-6">
          <Skeleton v-for="i in 8" :key="i" class="h-4 w-full" />
        </div>
      </template>

      <template v-else-if="txDetail?.transaction">
        <!-- Amount hero block -->
        <div class="px-6 py-4 bg-card/50 border-y border-border/40">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ t('transactions.amount') }}</span>
              <span
                :class="['text-2xl font-bold tabular-nums', amountClass(txDetail.transaction.type)]"
              >
                {{ amountPrefix(txDetail.transaction.type) }}{{ txDetail.transaction.amount }}
              </span>
            </div>
            <TransactionTypeBadge :type="txDetail.transaction.type" />
          </div>
        </div>

        <!-- Details list -->
        <dl class="flex flex-col divide-y divide-border/40 px-6">
          <div class="flex flex-col gap-1 py-3.5">
            <dt class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{{ t('transactions.type') }}</dt>
            <dd class="text-sm text-foreground">{{ TX_TYPE_LABELS[txDetail.transaction.type] }}</dd>
          </div>

          <div class="flex flex-col gap-1.5 py-3.5">
            <dt class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{{ t('transactions.transactionId') }}</dt>
            <dd class="rounded-md bg-muted/50 px-3 py-2 font-mono text-xs break-all text-foreground border border-border/30">
              {{ txDetail.transaction.transactionId }}
            </dd>
          </div>

          <div class="flex flex-col gap-1.5 py-3.5">
            <dt class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{{ t('transactions.internalId') }}</dt>
            <dd class="rounded-md bg-muted/30 px-3 py-2 font-mono text-xs break-all text-muted-foreground border border-border/20">
              {{ txDetail.transaction.id }}
            </dd>
          </div>

          <div class="flex flex-col gap-1.5 py-3.5">
            <dt class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{{ t('transactions.userId') }}</dt>
            <dd class="rounded-md bg-muted/30 px-3 py-2 font-mono text-xs break-all text-muted-foreground border border-border/20">
              {{ txDetail.transaction.userId }}
            </dd>
          </div>

          <Separator class="my-0 opacity-0" />

          <div class="flex flex-col gap-1 py-3.5">
            <dt class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{{ t('transactions.createdAt') }}</dt>
            <dd class="text-sm text-foreground font-medium">{{ formatDate(txDetail.transaction.createdAt) }}</dd>
          </div>
        </dl>
      </template>
    </SheetContent>
  </Sheet>
</template>
