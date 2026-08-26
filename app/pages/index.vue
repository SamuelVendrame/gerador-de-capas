<script setup lang="ts">
import { ref, onMounted } from "vue";
import PainelHistorico from "~/components/PainelHistorico.vue";

const abaAtiva = ref<"nova" | "historico">("nova");
const refHistorico = ref<InstanceType<typeof PainelHistorico> | null>(null);
const totalHistorico = ref(0);

async function carregarTotal() {
  try {
    const registros = await $fetch("/api/historico");
    totalHistorico.value = registros.length;
  } catch (erro) {
    console.error("Erro ao carregar total do histórico:", erro);
  }
}

onMounted(carregarTotal);

function aoGerarCapa() {
  carregarTotal();
  refHistorico.value?.carregarHistorico();
}
</script>

<template>
  <div class="pagina">
    <div class="card-central">
      <header class="cabecalho">
        <div class="logo-titulo">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <h1>Gerador de <span class="destaque">Capas</span></h1>
        </div>

        <nav class="abas">
          <button :class="{ ativa: abaAtiva === 'nova' }" @click="abaAtiva = 'nova'">Nova capa</button>
          <button :class="{ ativa: abaAtiva === 'historico' }" @click="abaAtiva = 'historico'">
            Histórico
                <span v-if="totalHistorico > 0" class="badge">{{ totalHistorico }}</span>
          </button>
        </nav>
      </header>

      <hr class="divisor" />

      <div class="conteudo">
        <WizardNovaCapa v-if="abaAtiva === 'nova'" @capa-gerada="aoGerarCapa" />
        <PainelHistorico v-else ref="refHistorico" />
      </div>
    </div>
  </div>
</template>

<style scoped>

* {
  font-family: "Tilt Neon", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box
}

html,
body {
  margin: 0;
  padding: 0;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: white;
}

.logo-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-titulo h1 {
  font-size: 18px;
  font-weight: 400;
  margin: 0;
}
.destaque { color: #7c3aed; }

.abas {
  display: flex;
  gap: 8px;
}
.abas button {
  padding: 8px 14px;
  background: #f0f0f0;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  font-weight: 500;
}

.abas button.ativa {
  background: rgba(124, 58, 237, 0.20);
  border-color: transparent;
  color: #7c3aed;
}

.badge {
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1px 7px;
  font-size: 12px;
  font-weight: 600;
}

.abas button.ativa .badge {
  background: #7c3aed; 
  color: white;
}

.divisor {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
}

.conteudo {
  padding: 24px;
  background-color: #f7f7f7;
}
</style>