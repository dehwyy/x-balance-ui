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
import type { User } from '@/entities/user'
import { useUpdateUser } from '@/shared/api/hooks'

interface Props {
  open: boolean
  user: User
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
const { t } = useI18n()

const name = ref(props.user.name)
const overdraftLimit = ref(props.user.overdraftLimit)
const nameError = ref('')
const overdraftError = ref('')

const { mutate: updateUser, isPending } = useUpdateUser()

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
  name.value = props.user.name
  overdraftLimit.value = props.user.overdraftLimit
  nameError.value = ''
  overdraftError.value = ''
}

function handleSubmit() {
  if (!validate()) return

  updateUser(
    {
      id: props.user.id,
      payload: {
        name: name.value.trim(),
        overdraftLimit: overdraftLimit.value,
      },
    },
    {
      onSuccess: () => {
        toast.success('User updated successfully')
        emit('update:open', false)
      },
      onError: (error: Error) => {
        toast.error(error.message ?? 'Failed to update user')
      },
    },
  )
}

watch(
  () => props.open,
  (open) => {
    if (!open) resetForm()
    else {
      name.value = props.user.name
      overdraftLimit.value = props.user.overdraftLimit
    }
  },
)

watch(
  () => props.user,
  (user) => {
    name.value = user.name
    overdraftLimit.value = user.overdraftLimit
  },
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('users.editUser') }}</DialogTitle>
        <DialogDescription>{{ t('users.updateDetails') }}</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <Label for="edit-user-name">{{ t('users.name') }}</Label>
          <Input
            id="edit-user-name"
            v-model="name"
            type="text"
            placeholder="John Doe"
            :disabled="isPending"
            :aria-invalid="!!nameError"
          />
          <p v-if="nameError" class="text-xs text-destructive">{{ nameError }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="edit-overdraft-limit">{{ t('users.overdraftLimit') }}</Label>
          <Input
            id="edit-overdraft-limit"
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
            {{ isPending ? 'Saving...' : 'Save Changes' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
