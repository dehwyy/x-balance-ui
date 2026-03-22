<script setup lang="ts">
import { ExternalLink, LogIn, LogOut } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/shared/stores'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const initials = computed(() => {
  if (!user.value) return 'U'
  return user.value.initials || user.value.name.slice(0, 2).toUpperCase()
})

function handleLogout() {
  authStore.logout()
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="backdrop-blur-xl bg-background/80 border border-border/60 sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>{{ isAuthenticated ? t('profile.profile') : t('profile.account') }}</DialogTitle>
      </DialogHeader>

      <!-- Authenticated state -->
      <template v-if="isAuthenticated && user">
        <div class="flex flex-col gap-5">
          <!-- Avatar + name -->
          <div class="flex items-center gap-3">
            <div
              class="h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground shrink-0"
              style="background: var(--primary)"
            >
              {{ initials }}
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-sm font-semibold text-foreground">{{ user.name }}</span>
              <span class="text-xs text-muted-foreground">x-balance user</span>
            </div>
          </div>

          <Separator />

          <!-- External links -->
          <div class="flex flex-col gap-1">
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{{ t('profile.services') }}</p>
            <Button
              variant="ghost"
              size="sm"
              class="justify-start gap-2 text-muted-foreground hover:text-foreground"
              as="a"
              href="#"
            >
              <ExternalLink :size="14" :stroke-width="1.5" />
              Paylonium
            </Button>
          </div>

          <Separator />

          <!-- Logout -->
          <Button
            variant="outline"
            size="sm"
            class="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
            @click="handleLogout"
          >
            <LogOut :size="14" :stroke-width="1.5" />
            {{ t('profile.logout') }}
          </Button>
        </div>
      </template>

      <!-- Guest state -->
      <template v-else>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <p class="text-sm text-muted-foreground">
              {{ t('profile.signInDesc') }}
            </p>
          </div>
          <Button
            size="sm"
            class="w-full gap-2"
            disabled
          >
            <LogIn :size="14" :stroke-width="1.5" />
            {{ t('profile.signIn') }}
          </Button>
          <p class="text-xs text-center text-muted-foreground">
            {{ t('profile.authComingSoon') }}
          </p>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>
