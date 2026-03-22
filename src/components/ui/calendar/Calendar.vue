<script setup lang="ts">
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarGridBody,
  CalendarCell,
  CalendarCellTrigger,
  CalendarPrev,
  CalendarNext,
  type DateValue,
} from 'reka-ui'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: DateValue
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: DateValue] }>()
</script>

<template>
  <CalendarRoot
    v-slot="{ weekDays, grid }"
    :model-value="props.modelValue"
    :class="cn('p-3', props.class)"
    @update:model-value="emit('update:modelValue', $event as DateValue)"
  >
    <CalendarHeader class="flex items-center justify-between mb-3">
      <CalendarPrev
        class="inline-flex items-center justify-center w-7 h-7 rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
      >
        <ChevronLeft :size="14" />
      </CalendarPrev>
      <CalendarHeading class="text-sm font-medium" />
      <CalendarNext
        class="inline-flex items-center justify-center w-7 h-7 rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
      >
        <ChevronRight :size="14" />
      </CalendarNext>
    </CalendarHeader>

    <CalendarGrid v-for="month in grid" :key="month.value.toString()">
      <CalendarGridHead>
        <CalendarGridRow class="flex">
          <CalendarHeadCell
            v-for="day in weekDays"
            :key="day"
            class="w-9 text-center text-xs text-muted-foreground font-normal"
          >
            {{ day }}
          </CalendarHeadCell>
        </CalendarGridRow>
      </CalendarGridHead>
      <CalendarGridBody>
        <CalendarGridRow
          v-for="(week, weekIndex) in month.rows"
          :key="weekIndex"
          class="flex mt-1"
        >
          <CalendarCell
            v-for="day in week"
            :key="day.toString()"
            :date="day"
            class="relative p-0 text-center text-sm"
          >
            <CalendarCellTrigger
              :day="day"
              :month="month.value"
              class="inline-flex items-center justify-center w-9 h-9 text-sm rounded-md cursor-pointer
                hover:bg-accent hover:text-accent-foreground
                data-[selected]:bg-primary data-[selected]:text-primary-foreground
                data-[today]:border data-[today]:border-primary/50
                data-[outside-month]:text-muted-foreground/40
                data-[disabled]:opacity-30 data-[disabled]:cursor-not-allowed
                transition-colors"
            />
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>
  </CalendarRoot>
</template>
