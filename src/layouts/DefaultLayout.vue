<script setup lang="ts">
import { HelpCircle, Home, Settings, User, Users } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ProfileModal } from '@/features/profile'
import { SettingsModal } from '@/features/settings'
import { ROUTES } from '@/shared/config/routes'
import { useAuthStore } from '@/shared/stores'

const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)

const pageTitle = computed(() => (route.meta.title as string) ?? 'x-balance')
const isSettingsOpen = ref(false)
const isProfileOpen = ref(false)

function isActive(routeName: ROUTES): boolean {
  if (routeName === ROUTES.USERS) {
    return route.name === ROUTES.USERS || route.name === ROUTES.USER_DETAIL
  }
  return route.name === routeName
}

const avatarInitials = computed(() => {
  if (!user.value) return 'U'
  return user.value.initials || user.value.name.slice(0, 2).toUpperCase()
})
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader class="px-4 pt-5 pb-4">
          <span class="text-base font-bold text-sidebar-foreground tracking-tight truncate">
            x-balance
          </span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{{ t('nav.dashboard') }}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu class="px-1">
                <SidebarMenuItem>
                  <SidebarMenuButton as-child :is-active="isActive(ROUTES.HOME)">
                    <RouterLink :to="{ name: ROUTES.HOME }" class="flex items-center gap-2 cursor-pointer">
                      <Home :size="16" :stroke-width="1.5" />
                      <span>{{ t('nav.home') }}</span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton as-child :is-active="isActive(ROUTES.USERS)">
                    <RouterLink :to="{ name: ROUTES.USERS }" class="flex items-center gap-2 cursor-pointer">
                      <Users :size="16" :stroke-width="1.5" />
                      <span>{{ t('nav.users') }}</span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton as-child :is-active="isActive(ROUTES.FAQ)">
                    <RouterLink :to="{ name: ROUTES.FAQ }" class="flex items-center gap-2 cursor-pointer">
                      <HelpCircle :size="16" :stroke-width="1.5" />
                      <span>{{ t('nav.faq') }}</span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <!-- Footer: Settings + Profile -->
        <SidebarFooter class="px-2 pb-3 pt-0">
          <SidebarSeparator class="mb-1" />
          <SidebarMenu>
            <!-- Settings -->
            <SidebarMenuItem>
              <SidebarMenuButton
                class="cursor-pointer"
                @click="isSettingsOpen = true"
              >
                <Settings :size="16" :stroke-width="1.5" />
                <span>{{ t('settings.title') }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <!-- Profile / Login -->
            <SidebarMenuItem>
              <SidebarMenuButton
                class="cursor-pointer"
                @click="isProfileOpen = true"
              >
                <!-- Authenticated: avatar -->
                <template v-if="isAuthenticated && user">
                  <div
                    class="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0"
                    style="background: var(--primary)"
                  >
                    {{ avatarInitials }}
                  </div>
                  <span class="truncate">{{ user.name }}</span>
                </template>
                <!-- Guest: login icon -->
                <template v-else>
                  <User :size="16" :stroke-width="1.5" />
                  <span>{{ t('nav.login') }}</span>
                </template>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <!-- Main: scroll at SidebarInset level so header is truly sticky -->
      <SidebarInset class="flex flex-col overflow-y-scroll">
        <header class="h-14 shrink-0 flex items-center px-4 gap-2 sticky top-0 z-20 border-b" style="background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border-color: var(--glass-border);">
          <SidebarTrigger />
          <span class="text-sm font-medium text-foreground flex-1">{{ pageTitle }}</span>
        </header>
        <div class="flex-1 p-6">
          <slot />
        </div>
      </SidebarInset>
    </SidebarProvider>

    <SettingsModal v-model:open="isSettingsOpen" />
    <ProfileModal v-model:open="isProfileOpen" />
  </div>
</template>
