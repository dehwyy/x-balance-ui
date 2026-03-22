<script setup lang="ts">
import { Monitor, Moon, Sun } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  type BackgroundPreset,
  type FontSize,
  type Language,
  type ThemeMode,
  useSettingsStore,
} from '@/shared/stores'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const settingsStore = useSettingsStore()
const { theme, language, fontSize, backgroundPreset } = storeToRefs(settingsStore)

type IconComponent = typeof Sun
const themeOptions: Array<{ value: ThemeMode; label: () => string; icon: IconComponent }> = [
  { value: 'light', label: () => t('settings.light'), icon: Sun },
  { value: 'dark', label: () => t('settings.dark'), icon: Moon },
  { value: 'auto', label: () => t('settings.system'), icon: Monitor },
]

const languageOptions: Array<{ value: Language; flag: string; label: string }> = [
  { value: 'en', flag: '🇺🇸', label: 'English' },
  { value: 'ru', flag: '🇷🇺', label: 'Русский' },
  { value: 'ja', flag: '🇯🇵', label: '日本語' },
]

const fontSizeOptions: Array<{ value: FontSize; label: () => string }> = [
  { value: 'xs', label: () => t('settings.fontSizes.xs') },
  { value: 'sm', label: () => t('settings.fontSizes.sm') },
  { value: 'md', label: () => t('settings.fontSizes.md') },
  { value: 'lg', label: () => t('settings.fontSizes.lg') },
  { value: 'xl', label: () => t('settings.fontSizes.xl') },
]

interface BgOption {
  value: BackgroundPreset
  colors: [string, string]
}

const bgOptions: BgOption[] = [
  { value: '1', colors: ['oklch(0.586 0.253 17.585)', 'oklch(0.274 0.006 286.033)'] },
  { value: '2', colors: ['oklch(0.65 0.17 168)', 'oklch(0.5 0.18 265)'] },
  { value: '3', colors: ['oklch(0.55 0.2 295)', 'oklch(0.65 0.22 5)'] },
  { value: '4', colors: ['oklch(0.45 0.18 255)', 'oklch(0.3 0.08 270)'] },
  { value: '5', colors: ['oklch(0.68 0.2 55)', 'oklch(0.58 0.22 30)'] },
  { value: '6', colors: ['oklch(0.55 0.18 155)', 'oklch(0.5 0.15 185)'] },
]
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md settings-dialog-content">
      <DialogHeader>
        <DialogTitle>{{ t('settings.title') }}</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-6 pt-2">
        <!-- Theme -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-medium text-foreground">{{ t('settings.theme') }}</h3>
          <div class="flex gap-2">
            <Button
              v-for="option in themeOptions"
              :key="option.value"
              variant="outline"
              size="sm"
              :class="theme === option.value ? 'border-primary text-primary' : ''"
              @click="theme = option.value"
            >
              <component :is="option.icon" :size="14" class="mr-1.5" />
              {{ option.label() }}
            </Button>
          </div>
        </div>

        <!-- Background -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-medium text-foreground">{{ t('settings.background') }}</h3>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="opt in bgOptions"
              :key="opt.value"
              :title="t(`settings.backgrounds.${opt.value}`)"
              class="relative h-8 w-full rounded-md border-2 overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              :class="backgroundPreset === opt.value ? 'border-primary scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'"
              :style="`background: linear-gradient(135deg, ${opt.colors[0]} 0%, ${opt.colors[1]} 100%)`"
              @click="backgroundPreset = opt.value"
            />
          </div>
          <div class="text-xs text-muted-foreground text-center">
            {{ t(`settings.backgrounds.${backgroundPreset}`) }}
          </div>
        </div>

        <!-- Language -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-medium text-foreground">{{ t('settings.language') }}</h3>
          <div class="flex gap-2 flex-wrap">
            <Button
              v-for="option in languageOptions"
              :key="option.value"
              variant="outline"
              size="sm"
              :class="language === option.value ? 'border-primary text-primary' : ''"
              @click="language = option.value"
            >
              <span class="mr-1.5 text-base leading-none">{{ option.flag }}</span>
              {{ option.label }}
            </Button>
          </div>
        </div>

        <!-- Font Size -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-medium text-foreground">{{ t('settings.fontSize') }}</h3>
          <div class="flex gap-2 flex-wrap">
            <Button
              v-for="option in fontSizeOptions"
              :key="option.value"
              variant="outline"
              size="sm"
              :class="fontSize === option.value ? 'border-primary text-primary' : ''"
              @click="fontSize = option.value"
            >
              {{ option.label() }}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
