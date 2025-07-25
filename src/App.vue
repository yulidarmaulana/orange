<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import CardHero from './components/CardHero.vue'

const walletAddress = ref('')
// const walletAddress = ref('')

</script>

<template>
  <div>
    <HelloWorld />
    <div class="mb-4 bg-slate-50 text-white p-2 rounded-lg shadow-xs">
      <input
        v-model="walletAddress"
        type="text"
        placeholder="Enter Bitcoin wallet address"
        class="border border-slate-300 rounded px-2 py-1 w-full bg-slate-200 text-slate-800"
      />
    </div>
    <CardHero v-if="walletAddress !== ''" :wallet-address="walletAddress" />
    <CardHero v-else :wallet-address="'1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'" />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
