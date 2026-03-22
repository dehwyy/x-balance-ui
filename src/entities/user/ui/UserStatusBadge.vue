<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import type { User } from '../model/types'
import { isDeleted } from '../model/types'

interface Props {
  user: User
}

const props = defineProps<Props>()

const deleted = computed(() => isDeleted(props.user))
</script>

<template>
  <Badge :variant="deleted ? 'destructive' : 'default'">
    {{ deleted ? 'Deleted' : 'Active' }}
  </Badge>
</template>
