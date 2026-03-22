<script setup lang="ts">
import { PopoverPortal, PopoverContent as RekaPopoverContent } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes['class']
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}>()
</script>
<template>
  <PopoverPortal>
    <RekaPopoverContent
      :align="props.align ?? 'center'"
      :side-offset="props.sideOffset ?? 4"
      v-bind="$attrs"
      :class="cn(
        'bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        props.class
      )"
    >
      <slot />
    </RekaPopoverContent>
  </PopoverPortal>
</template>