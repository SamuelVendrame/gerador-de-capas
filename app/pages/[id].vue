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
  <div class="pagina">
    <div class="card-central">
      <p v-if="carregando">Carregando...</p>
      <p v-else-if="!registro">Capa não encontrada.</p>
      <DetalheCapa v-else :registro="registro" :mostrar-voltar="false" />
    </div>
  </div>
</template>

<style scoped>
.pagina { min-height: 100vh; width: 100%; padding: 40px 20px; box-sizing: border-box; }
.card-central { max-width: 900px; margin: 0 auto; background: white; border-radius: var(--raio-card); box-shadow: var(--sombra-card); padding: 24px; }
</style>