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
import { useFreeze } from '@/shared/api/hooks'
import { generateTxId } from '@/shared/lib/uuid'

interface Props {
  open: boolean
  userId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
const { t } = useI18n()

const amount = ref('')
const freezeTimeout = ref('0')
const amountError = ref('')
const timeoutError = ref('')

const { mutate: freeze, isPending } = useFreeze()

const DECIMAL_RE = /^\d+(\.\d{1,2})?$/

function validate(): boolean {
  amountError.value = ''
  timeoutError.value = ''
  let valid = true

  if (!DECIMAL_RE.test(amount.value)) {
    amountError.value = 'Must be a valid decimal (e.g. 10.00)'
    valid = false
  }

  const timeoutVal = freezeTimeout.value.trim()
  if (timeoutVal !== '' && !/^\d+$/.test(timeoutVal)) {
    timeoutError.value = 'Must be a non-negative integer'
    valid = false
  }

  return valid
}

function resetForm() {
  amount.value = ''
  freezeTimeout.value = '0'
  amountError.value = ''
  timeoutError.value = ''
}

function handleSubmit() {
  if (!validate()) return

  const transactionId = generateTxId()
  const timeoutVal = freezeTimeout.value.trim()
  const timeoutSeconds =
    timeoutVal === '' || timeoutVal === '0' ? undefined : parseInt(timeoutVal, 10)

  freeze(
    {
      userId: props.userId,
      payload: {
        amount: amount.value,
        transactionId,
        ...(timeoutSeconds !== undefined && { freezeTimeoutSeconds: timeoutSeconds }),
      },
    },
    {
      onSuccess: (data) => {
        toast.success(`Frozen ${data.frozenAmount} (tx: ${data.transactionId})`)
        emit('update:open', false)
      },
      onError: (error: Error) => {
        toast.error(error.message ?? 'Failed to freeze balance')
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
        <DialogTitle>{{ t('balance.freezeBalance') }}</DialogTitle>
        <DialogDescription>{{ t('balance.holdFunds') }}</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <Label for="freeze-amount">{{ t('balance.amount') }}</Label>
          <Input
            id="freeze-amount"
            v-model="amount"
            type="text"
            placeholder="0.00"
            :disabled="isPending"
            :aria-invalid="!!amountError"
          />
          <p v-if="amountError" class="text-xs text-destructive">{{ amountError }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="freeze-timeout">{{ t('balance.freezeTimeout') }}</Label>
          <Input
            id="freeze-timeout"
            v-model="freezeTimeout"
            type="text"
            placeholder="0"
            :disabled="isPending"
            :aria-invalid="!!timeoutError"
          />
          <p v-if="timeoutError" class="text-xs text-destructive">{{ timeoutError }}</p>
        </div>

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
            {{ isPending ? 'Processing...' : 'Freeze' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
