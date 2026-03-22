<script setup lang="ts">
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
import type { User } from '@/entities/user'
import { useDeleteUser } from '@/shared/api/hooks'

interface Props {
  open: boolean
  user: User
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [boolean] }>()

const { mutate: deleteUser, isPending } = useDeleteUser()

function handleConfirm() {
  deleteUser(props.user.id, {
    onSuccess: () => {
      toast.success(`User "${props.user.name}" deleted`)
      emit('update:open', false)
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to delete user')
    },
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          Delete user <strong>{{ user.name }}</strong>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          :disabled="isPending"
          @click="emit('update:open', false)"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          :disabled="isPending"
          @click="handleConfirm"
        >
          {{ isPending ? 'Deleting...' : 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
