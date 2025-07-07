<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import CardHero from './components/CardHero.vue'

const walletAddress = ref('bc1qhayshz2hy9upvatmp0m02vj6eudk48w3p4nlh0')
</script>

<template>
  <div>
    <HelloWorld />
    <div class="mb-4">
      <input
        v-model="walletAddress"
        type="text"
        placeholder="Enter Bitcoin wallet address"
        class="border rounded px-2 py-1 w-full max-w-md"
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
