<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const { t, tm } = useI18n()

const faqs = tm('faq.items') as Array<{ q: string; a: string }>
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{{ t('faq.title') }}</h1>
        <p class="mt-2 text-muted-foreground">{{ t('faq.subtitle') }}</p>
      </div>

      <div class="rounded-xl border border-border/50 backdrop-blur-xl bg-card/50 overflow-hidden shadow-sm">
        <Accordion type="multiple" class="px-6">
          <AccordionItem
            v-for="(faq, i) in faqs"
            :key="i"
            :value="`faq-${i}`"
          >
            <AccordionTrigger>{{ faq.q }}</AccordionTrigger>
            <AccordionContent>{{ faq.a }}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </DefaultLayout>
</template>
