import { useColorMode, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { watch } from 'vue'
import { i18n } from '@/shared/i18n'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type Language = 'en' | 'ru' | 'ja'
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type BackgroundPreset = '1' | '2' | '3' | '4' | '5' | '6'

export const useSettingsStore = defineStore('settings', () => {
  const theme = useLocalStorage<ThemeMode>('xb-theme', 'dark')
  const language = useLocalStorage<Language>('xb-language', 'en')
  const fontSize = useLocalStorage<FontSize>('xb-font-size', 'md')
  const backgroundPreset = useLocalStorage<BackgroundPreset>('xb-bg-preset', '1')

  const colorMode = useColorMode()

  watch(
    theme,
    (val) => {
      colorMode.value = val
    },
    { immediate: true },
  )

  watch(
    fontSize,
    (val) => {
      document.documentElement.setAttribute('data-font-size', val)
    },
    { immediate: true },
  )

  watch(
    language,
    (val) => {
      i18n.global.locale.value = val
    },
    { immediate: true },
  )

  watch(
    backgroundPreset,
    (val) => {
      document.documentElement.setAttribute('data-bg', val)
    },
    { immediate: true },
  )

  return { theme, language, fontSize, backgroundPreset }
})
