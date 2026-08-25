<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const registro = ref<any>(null);
const carregando = ref(true);

onMounted(async () => {
  const historico = await $fetch("/api/historico");
  registro.value = historico.find((r: any) => r.id === route.params.id);
  carregando.value = false;
});
</script>

<template>
  <p v-if="carregando">Carregando...</p>
  <p v-else-if="!registro">Capa não encontrada.</p>
  <DetalheCapa v-else :registro="registro" :mostrar-voltar="false" />
</template>