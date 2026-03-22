<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { UsersListWidget } from '@/widgets/users-list'

const { t } = useI18n()
</script>

<template>
  <DefaultLayout>
    <div>
      <h1 class="text-2xl font-semibold mb-6">{{ t('users.title') }}</h1>
      <UsersListWidget />
    </div>
  </DefaultLayout>
</template>
