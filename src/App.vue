<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import CardHero from './components/CardHero.vue'

const walletAddress = ref('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
</script>

<template>
  <div>
    <HelloWorld />
    <div class="mb-4">
      <input
        v-model="walletAddress"
        type="text"
        placeholder="Enter Bitcoin wallet address"
        class="border rounded px-2 py-1 w-full"
      />
    </div>
    <CardHero :wallet-address="walletAddress" />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
