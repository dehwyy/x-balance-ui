<script setup lang="ts">
import { ref, watch } from 'vue'
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
import { useCreateUser } from '@/shared/api/hooks'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [boolean] }>()

const name = ref('')
const overdraftLimit = ref('0.00')
const nameError = ref('')
const overdraftError = ref('')

const { mutate: createUser, isPending } = useCreateUser()

const DECIMAL_RE = /^\d+(\.\d{1,2})?$/

function validate(): boolean {
  nameError.value = ''
  overdraftError.value = ''
  let valid = true

  if (!name.value.trim()) {
    nameError.value = 'Name is required'
    valid = false
  }

  if (!DECIMAL_RE.test(overdraftLimit.value)) {
    overdraftError.value = 'Must be a valid decimal (e.g. 0.00)'
    valid = false
  }

  return valid
}

function resetForm() {
  name.value = ''
  overdraftLimit.value = '0.00'
  nameError.value = ''
  overdraftError.value = ''
}

function handleSubmit() {
  if (!validate()) return

  createUser(
    { name: name.value.trim(), overdraftLimit: overdraftLimit.value },
    {
      onSuccess: () => {
        toast.success('User created successfully')
        emit('update:open', false)
      },
      onError: (error: Error) => {
        toast.error(error.message ?? 'Failed to create user')
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
        <DialogTitle>Create User</DialogTitle>
        <DialogDescription>Add a new user to the system.</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <Label for="user-name">Name</Label>
          <Input
            id="user-name"
            v-model="name"
            type="text"
            placeholder="John Doe"
            :disabled="isPending"
            :aria-invalid="!!nameError"
          />
          <p v-if="nameError" class="text-xs text-destructive">{{ nameError }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="overdraft-limit">Overdraft Limit</Label>
          <Input
            id="overdraft-limit"
            v-model="overdraftLimit"
            type="text"
            placeholder="0.00"
            :disabled="isPending"
            :aria-invalid="!!overdraftError"
          />
          <p v-if="overdraftError" class="text-xs text-destructive">{{ overdraftError }}</p>
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
            {{ isPending ? 'Creating...' : 'Create' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
