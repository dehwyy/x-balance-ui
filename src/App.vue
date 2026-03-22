<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import { useSettingsStore } from '@/shared/stores'

const settings = useSettingsStore()
const { theme } = storeToRefs(settings)

// vue-sonner accepts 'light' | 'dark' | 'system', not 'auto'
const toasterTheme = computed(() => (theme.value === 'auto' ? 'system' : theme.value))
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <Toaster rich-colors :theme="toasterTheme" close-button position="top-right" />
</template>
