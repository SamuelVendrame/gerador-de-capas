<script setup lang="ts">
import PainelHistorico from "~/components/PainelHistorico.vue";
import { ref } from "vue";

const abaAtiva = ref<"nova" | "historico">("nova");
const refHistorico = ref<InstanceType<typeof PainelHistorico> | null>(null);

function aoGerarCapa() {
  refHistorico.value?.carregarHistorico();
}
</script>

<template>
  <div class="pagina">
    <div class="card-central">
      <div class="abas">
        <button :class="{ ativa: abaAtiva === 'nova' }" @click="abaAtiva = 'nova'">Nova capa</button>
        <button :class="{ ativa: abaAtiva === 'historico' }" @click="abaAtiva = 'historico'">Histórico</button>
      </div>

      <WizardNovaCapa v-if="abaAtiva === 'nova'" @capa-gerada="aoGerarCapa" />
      <PainelHistorico v-else ref="refHistorico" />
    </div>
  </div>
</template>

<style scoped>
.pagina { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
.card-central { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.abas { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #e0e0e0; }
.abas button {
  padding: 10px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 15px;
  color: #666;
}
.abas button.ativa {
  color: #7c3aed;
  border-bottom-color: #7c3aed;
  font-weight: 600;
}
</style>