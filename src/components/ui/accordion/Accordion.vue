<script setup lang="ts">
import type { AccordionRootProps } from 'reka-ui'
import { AccordionRoot } from 'reka-ui'

const props = defineProps<AccordionRootProps & { class?: string }>()
</script>
<template>
  <AccordionRoot v-bind="props">
    <slot />
  </AccordionRoot>
</template>