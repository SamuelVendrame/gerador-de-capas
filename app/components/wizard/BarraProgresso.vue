<script setup lang="ts">
  defineProps<{
    etapaAtual: number; 
    totalEtapas: number;
  }>();
</script>

<template>
  <div>

  </div>
  
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
  background-color: #f1f1f1;;
}
.segmento {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #bbbbbb;
  transition: background 0.3s;
}
.segmento.preenchido {
  background: #7c3aed;
}
</style>