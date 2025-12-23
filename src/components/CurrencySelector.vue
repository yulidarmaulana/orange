<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { SUPPORTED_CURRENCIES, type Currency } from '../utils/currency'

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const props = defineProps<{
  modelValue: string
}>()

const selectedCurrency = ref<Currency>(
  SUPPORTED_CURRENCIES.find(c => c.code === props.modelValue) || SUPPORTED_CURRENCIES[0]
)

function selectCurrency(currency: Currency) {
  selectedCurrency.value = currency
  localStorage.setItem('preferred_currency', currency.code)
  emit('update:modelValue', currency.code)
}

onMounted(() => {
  const saved = localStorage.getItem('preferred_currency')
  if (saved) {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === saved)
    if (currency) {
      selectedCurrency.value = currency
      emit('update:modelValue', currency.code)
    }
  }
})
</script>

<template>
  <Listbox v-model="selectedCurrency" @update:modelValue="selectCurrency">
    <div class="relative">
      <ListboxButton
        class="relative w-full cursor-pointer rounded-lg bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-slate-300 dark:border-slate-600"
      >
        <span class="block truncate text-slate-900 dark:text-slate-100">
          {{ selectedCurrency.symbol }} {{ selectedCurrency.code.toUpperCase() }}
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown class="h-4 w-4 text-slate-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-50 mt-1 max-h-30 w-full overflow-auto rounded-md bg-slate-200 dark:bg-slate-800 py-1 text-base shadow-md ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="currency in SUPPORTED_CURRENCIES"
            :key="currency.code"
            :value="currency"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100' : 'text-slate-900 dark:text-slate-100',
                'relative cursor-pointer select-none py-2 pl-10 pr-4',
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                {{ currency.symbol }} {{ currency.code.toUpperCase() }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600 dark:text-orange-400"
              >
                <Check class="h-4 w-4" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
