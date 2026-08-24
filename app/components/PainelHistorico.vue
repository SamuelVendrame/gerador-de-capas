<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { RegistroHistorico } from "~~/shared/schemaHistorico";

const registros = ref<RegistroHistorico[]>([]);
const carregando = ref(true);

async function carregarHistorico() {
  carregando.value = true;
  try {
    registros.value = await $fetch("/api/historico");
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);
  } finally {
    carregando.value = false;
  }
}

onMounted(carregarHistorico);

defineExpose({ carregarHistorico }); // permite o pai chamar isso de fora

const LABELS_STATUS: Record<string, string> = {
  concluido: "Concluído",
  em_processamento: "Em processamento",
  cancelado: "Cancelado após 3 tentativas",
};
</script>

<template>
  <div class="painel-historico">
    <p v-if="carregando">Carregando...</p>
    <p v-else-if="registros.length === 0" class="vazio">Nenhuma capa gerada ainda.</p>

    <div v-for="registro in registros" :key="registro.id" class="item-historico">
      <div class="info">
        <strong>{{ registro.titulo }}</strong>
        <span class="autor">{{ registro.autor }}</span>
      </div>
      <div class="status" :class="registro.status">
        {{ LABELS_STATUS[registro.status] }}
      </div>
      <p v-if="registro.motivoCancelamento" class="motivo">{{ registro.motivoCancelamento }}</p>
      <button v-if="registro.status === 'cancelado'" class="btn-tentar-novamente">
        Tentar Novamente
      </button>
    </div>
  </div>
</template>

<style scoped>
.painel-historico { display: flex; flex-direction: column; gap: 12px; }
.vazio { color: #999; text-align: center; padding: 24px 0; }
.item-historico {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}
.info { display: flex; flex-direction: column; margin-bottom: 8px; }
.autor { color: #666; font-size: 14px; }
.status { display: inline-block; font-size: 13px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
.status.concluido { background: #e8f5e9; color: #2e7d32; }
.status.em_processamento { background: #fff3e0; color: #e65100; }
.status.cancelado { background: #ffebee; color: #c62828; }
.motivo { font-size: 13px; color: #999; margin: 8px 0 0; }
.btn-tentar-novamente {
  margin-top: 8px;
  padding: 6px 12px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
</style>