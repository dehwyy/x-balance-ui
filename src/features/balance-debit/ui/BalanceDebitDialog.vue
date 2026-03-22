<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebit } from '@/shared/api/hooks'
import { generateTxId } from '@/shared/lib/uuid'

interface Props {
  open: boolean
  userId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
const { t } = useI18n()

const amount = ref('')
const amountError = ref('')

const { mutate: debit, isPending } = useDebit()

const DECIMAL_RE = /^\d+(\.\d{1,2})?$/

function validate(): boolean {
  amountError.value = ''
  if (!DECIMAL_RE.test(amount.value)) {
    amountError.value = 'Must be a valid decimal (e.g. 10.00)'
    return false
  }
  return true
}

function resetForm() {
  amount.value = ''
  amountError.value = ''
}

function handleSubmit() {
  if (!validate()) return

  const transactionId = generateTxId()

  debit(
    {
      userId: props.userId,
      payload: { amount: amount.value, transactionId },
    },
    {
      onSuccess: (data) => {
        toast.success(`Balance debited. New balance: ${data.newBalance}`)
        emit('update:open', false)
      },
      onError: (error: Error) => {
        toast.error(error.message ?? 'Failed to debit balance')
      },
    },
  )
}

watch(
  () => props.open,
  (open) => {
    if (!open) resetForm()
  },
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('balance.debitBalance') }}</DialogTitle>
        <DialogDescription>{{ t('balance.deductFunds') }}</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <Label for="debit-amount">{{ t('balance.amount') }}</Label>
          <Input
            id="debit-amount"
            v-model="amount"
            type="text"
            placeholder="0.00"
            :disabled="isPending"
            :aria-invalid="!!amountError"
          />
          <p v-if="amountError" class="text-xs text-destructive">{{ amountError }}</p>
        </div>

        <p class="text-xs text-muted-foreground">
          Note: Balance may go negative within the overdraft limit.
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            :disabled="isPending"
            @click="emit('update:open', false)"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="isPending">
            {{ isPending ? 'Processing...' : 'Debit' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
