<script setup lang="ts">
defineProps<{
  etapaAtual: number; // 1 a 4
  totalEtapas: number;
}>();
</script>

<template>
  <div class="barra-progresso">
    <div
      v-for="n in totalEtapas"
      :key="n"
      class="segmento"
      :class="{ preenchido: n <= etapaAtual }"
    />
  </div>
</template>

<style scoped>
.barra-progresso {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.segmento {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  transition: background 0.3s;
}
.segmento.preenchido {
  background: #7c3aed; /* roxo */
}
</style>