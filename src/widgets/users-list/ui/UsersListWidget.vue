<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { Pencil, Trash2, UserPlus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { User } from '@/entities/user'
import { isDeleted, UserStatusBadge } from '@/entities/user'
import { UserCreateDialog } from '@/features/user-create'
import { UserDeleteDialog } from '@/features/user-delete'
import { UserEditDialog } from '@/features/user-edit'
import { useGetUsers } from '@/shared/api/hooks'
import { ROUTES } from '@/shared/config/routes'

const router = useRouter()
const { t } = useI18n()

const { data, isLoading } = useGetUsers()

const showDeleted = ref(false)
const createOpen = ref(false)
const editOpen = ref(false)
const deleteOpen = ref(false)
const selectedUser = ref<User | null>(null)

const users = computed(() => {
  const all = data.value?.users ?? []
  // По умолчанию показываем только активных (deleted_at === null)
  // При showDeleted = true показываем всех
  return showDeleted.value ? all : all.filter((u) => !isDeleted(u))
})

function navigateToUser(user: User) {
  router.push({ name: ROUTES.USER_DETAIL, params: { id: user.id } })
}

function openEdit(user: User, event: Event) {
  event.stopPropagation()
  selectedUser.value = user
  editOpen.value = true
}

function openDelete(user: User, event: Event) {
  event.stopPropagation()
  selectedUser.value = user
  deleteOpen.value = true
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :class="showDeleted ? 'border-primary' : ''"
          @click="showDeleted = !showDeleted"
        >
          {{ showDeleted ? 'Hide Deleted' : 'Show Deleted' }}
        </Button>
      </div>
      <Button size="sm" class="gap-2" @click="createOpen = true">
        <UserPlus :size="14" :stroke-width="1.5" />
        Add User
      </Button>
    </div>

    <div class="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ t('users.name') }}</TableHead>
            <TableHead class="hidden md:table-cell">{{ t('users.overdraftLimit') }}</TableHead>
            <TableHead class="hidden md:table-cell">{{ t('users.createdAt') }}</TableHead>
            <TableHead>{{ t('users.status') }}</TableHead>
            <TableHead class="text-right">{{ t('users.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-auto-animate>
          <template v-if="isLoading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell><Skeleton class="h-4 w-32" /></TableCell>
              <TableCell class="hidden md:table-cell"><Skeleton class="h-4 w-20" /></TableCell>
              <TableCell class="hidden md:table-cell"><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell><Skeleton class="h-5 w-16 rounded-full" /></TableCell>
              <TableCell class="text-right"><Skeleton class="h-8 w-20 ml-auto" /></TableCell>
            </TableRow>
          </template>

          <template v-else-if="users.length === 0">
            <TableRow>
              <TableCell colspan="5" class="text-center py-12 text-muted-foreground">
                No users found. Create your first user.
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow
              v-for="user in users"
              :key="user.id"
              class="cursor-pointer hover:bg-muted/50 transition-colors"
              @click="navigateToUser(user)"
            >
              <TableCell class="font-medium">{{ user.name }}</TableCell>
              <TableCell class="hidden md:table-cell tabular-nums text-muted-foreground">
                {{ user.overdraft_limit }}
              </TableCell>
              <TableCell class="hidden md:table-cell text-muted-foreground">
                {{ formatDate(user.createdAt) }}
              </TableCell>
              <TableCell>
                <UserStatusBadge :user="user" />
              </TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit user"
                    class="h-7 w-7 focus-visible:ring-2 focus-visible:ring-ring"
                    @click="openEdit(user, $event)"
                  >
                    <Pencil :size="13" :stroke-width="1.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete user"
                    :disabled="isDeleted(user)"
                    class="h-7 w-7 text-destructive hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:cursor-not-allowed"
                    @click="openDelete(user, $event)"
                  >
                    <Trash2 :size="13" :stroke-width="1.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>

  <UserCreateDialog v-model:open="createOpen" />

  <UserEditDialog
    v-if="selectedUser && editOpen"
    :open="editOpen"
    :user="selectedUser"
    @update:open="editOpen = $event"
  />

  <UserDeleteDialog
    v-if="selectedUser && deleteOpen"
    :open="deleteOpen"
    :user="selectedUser"
    @update:open="deleteOpen = $event"
  />
</template>
