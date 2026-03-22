<script setup lang="ts">
import { type CalendarDate, type DateValue, parseDate } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string // YYYY-MM-DD
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { t } = useI18n()

const calendarValue = computed<DateValue | undefined>(() => {
  if (!props.modelValue) return undefined
  try {
    return parseDate(props.modelValue)
  } catch {
    return undefined
  }
})

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  try {
    const [year, month, day] = props.modelValue.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return props.modelValue
  }
})

function onSelect(date: DateValue) {
  const d = date as CalendarDate
  const y = d.year
  const m = String(d.month).padStart(2, '0')
  const day = String(d.day).padStart(2, '0')
  emit('update:modelValue', `${y}-${m}-${day}`)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'h-8 w-44 justify-start text-left font-normal text-sm',
          !modelValue && 'text-muted-foreground',
          props.class
        )"
      >
        <CalendarIcon :size="14" class="mr-2 shrink-0" />
        <span>{{ displayValue || t('common.pickDate') }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar :model-value="calendarValue" @update:model-value="onSelect" />
    </PopoverContent>
  </Popover>
</template>
