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
import { useUnfreeze } from '@/shared/api/hooks'

interface Props {
  open: boolean
  userId: string
  freezeTxId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
const { t } = useI18n()

const transactionId = ref(props.freezeTxId ?? '')
const txError = ref('')

const { mutate: unfreeze, isPending } = useUnfreeze()

function validate(): boolean {
  txError.value = ''
  if (!transactionId.value.trim()) {
    txError.value = 'Freeze Transaction ID is required'
    return false
  }
  return true
}

function resetForm() {
  transactionId.value = props.freezeTxId ?? ''
  txError.value = ''
}

function handleSubmit() {
  if (!validate()) return

  unfreeze(
    {
      userId: props.userId,
      payload: { transactionId: transactionId.value.trim() },
    },
    {
      onSuccess: (data) => {
        toast.success(`Unfrozen ${data.unfrozenAmount} (tx: ${data.transactionId})`)
        emit('update:open', false)
      },
      onError: (error: Error) => {
        toast.error(error.message ?? 'Failed to unfreeze balance')
      },
    },
  )
}

watch(
  () => props.open,
  (open) => {
    if (!open) resetForm()
    else transactionId.value = props.freezeTxId ?? ''
  },
)

watch(
  () => props.freezeTxId,
  (id) => {
    transactionId.value = id ?? ''
  },
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('balance.unfreezeBalance') }}</DialogTitle>
        <DialogDescription>{{ t('balance.releaseFunds') }}</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <Label for="freeze-tx-id">{{ t('balance.freezeTransactionId') }}</Label>
          <Input
            id="freeze-tx-id"
            v-model="transactionId"
            type="text"
            placeholder="Enter freeze transaction ID"
            :disabled="isPending"
            :aria-invalid="!!txError"
          />
          <p class="text-xs text-muted-foreground">
            Enter the transaction_id of the FREEZE_HOLD transaction to release.
          </p>
          <p v-if="txError" class="text-xs text-destructive">{{ txError }}</p>
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
            {{ isPending ? 'Processing...' : 'Unfreeze' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
