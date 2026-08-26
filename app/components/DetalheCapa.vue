<script setup lang="ts">
import { ref, watch } from "vue";
import { useDetalheCapa } from "~/composables/useDetalheCapa";

const props = defineProps<{
  registro: any;
  mostrarVoltar?: boolean;
}>();

const emit = defineEmits<{ fechar: [] }>();

const { baixarImagem, gerarVariacao, trocarLayout, registroSelecionado, ajustarInstrucoes, baixarPdf } = useDetalheCapa();
registroSelecionado.value = props.registro;

watch(() => props.registro, (novo) => { registroSelecionado.value = novo; });

const novoLayout = ref(props.registro.layout ?? "");
const novaFonte = ref(props.registro.fonte ?? "");

const LAYOUTS = [
  { valor: "centralizado", label: "Centralizado" },
  { valor: "topoBase", label: "Topo + Base" },
  { valor: "rodape", label: "Rodapé" },
  { valor: "faixa", label: "Faixa" },
  { valor: "direita", label: "Alinhado à direita" },
];

const FONTES = [
  { valor: "Playfair Display" },
  { valor: "Cormorant Garamond" },
  { valor: "Bebas Neue" },
  { valor: "Space Grotesk" },
  { valor: "Baloo 2" },
];

async function selecionarFonte(fonte: string) {
  novaFonte.value = fonte;
  await trocarLayout(novoLayout.value, novaFonte.value);
}

async function selecionarLayout(layout: string) {
  novoLayout.value = layout;
  await trocarLayout(novoLayout.value, novaFonte.value);
}
</script>

<template>
  <div class="detalhe-capa">
    <button v-if="mostrarVoltar !== false" class="btn-voltar" @click="emit('fechar')">← Voltar ao histórico</button>

    <div class="grid-detalhe">
      <div class="coluna-imagem">
        <img v-if="registroSelecionado?.caminhoImagem" :src="registroSelecionado.caminhoImagem" class="imagem-grande" alt="Capa gerada" />
        <div class="legenda-imagem">
          <span>1600 × 2400</span>
          <span>{{ registroSelecionado?.fonte }}</span>
        </div>
      </div>

      <div class="coluna-info">
        <span class="pill-status" :class="registroSelecionado?.status === 'concluido' ? 'pill-concluido' : 'pill-cancelado'">
          {{ registroSelecionado?.status === 'concluido' ? 'Aprovado' : 'Cancelado' }}
        </span>

        <h2 class="titulo-tilt">{{ registroSelecionado?.titulo }}</h2>
        <p class="autor-tema">{{ registroSelecionado?.autor }} · {{ registroSelecionado?.genero }}</p>

     <div class="card-ajuste">
  <div class="colunas-ajuste">
    <div class="bloco-ajuste">
      <h3 class="titulo-ajuste">TROCAR TIPOGRAFIA</h3>
      <div class="opcoes-select">
        <button
          v-for="f in FONTES"
          :key="f.valor"
          class="opcao-select"
          :class="{ selecionado: novaFonte === f.valor }"
          :style="{ fontFamily: f.valor }"
          @click="selecionarFonte(f.valor)"
        >
          {{ f.valor }}
        </button>
      </div>
    </div>

    <div class="separador-vertical" />
        <div class="bloco-ajuste">
          <h3 class="titulo-ajuste">LAYOUT</h3>
          <div class="opcoes-select">
            <button
              v-for="l in LAYOUTS"
              :key="l.valor"
              class="opcao-select"
              :class="{ selecionado: novoLayout === l.valor }"
              @click="selecionarLayout(l.valor)"
            >
              {{ l.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

        <div class="card-resumo">
          <h3 class="titulo-card">Resumo do processo</h3>
          <div class="estatisticas">
            <div class="estatistica">
              <strong>{{ registroSelecionado?.tentativasImagem ?? 0 }}</strong>
              <span>tentativas de imagem</span>
            </div>
            <div class="estatistica">
              <strong>{{ registroSelecionado?.ajustesAgente ?? 0 }}</strong>
              <span>ajustes do agente</span>
            </div>
            <div class="estatistica">
              <strong>{{ registroSelecionado?.duracaoSegundos?.toFixed(1) ?? "—" }}s</strong>
              <span>tempo total</span>
            </div>
          </div>

          <hr v-if="registroSelecionado?.logProcesso?.length" class="separador" />

          <div v-if="registroSelecionado?.logProcesso?.length" class="log-processo">
            <p v-for="(evento, i) in registroSelecionado.logProcesso" :key="i" class="linha-log">
              {{ evento.comentario }}
            </p>
          </div>
        </div>

        <div class="acoes">
          <button class="btn-acao" @click="baixarImagem">Baixar imagem</button>
          <button class="btn-acao" @click="baixarPdf">Baixar PDF</button>
          <button class="btn-acao" @click="gerarVariacao">Gerar variação</button>
          <button class="btn-acao" @click="ajustarInstrucoes">Ajustar instruções</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalhe-capa { display: flex; flex-direction: column; gap: 16px; }
.btn-voltar { align-self: flex-start; background: none; border: none; color: var(--cor-primaria, #7c3aed); cursor: pointer; font-size: 14px; }

.grid-detalhe {
  display: grid;
  grid-template-columns: 2.3fr 1fr;
  gap: 32px;
  align-items: start;
}

.coluna-imagem { display: flex; flex-direction: column; gap: 8px; }
.imagem-grande { width: 100%; border-radius: 12px; display: block; }
.legenda-imagem { display: flex; justify-content: space-between; font-size: 13px; color: #999; }

.coluna-info { display: flex; flex-direction: column; gap: 16px; }

.pill-status {
  display: inline-block;
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.pill-concluido { background: #e8f5e9; color: #2e7d32; }
.pill-cancelado { background: #ffebee; color: #c62828; }

.titulo-tilt {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.autor-tema { color: #666; margin: 0; font-size: 14px; }

.resumo-processo, .decisoes-agente { background: white; padding: 16px; border-radius: 8px; }
.estatisticas { display: flex; gap: 24px; margin-top: 8px; }
.estatistica { display: flex; flex-direction: column; align-items: center; }
.estatistica strong { font-size: 20px; color: var(--cor-primaria, #7c3aed); }
.estatistica span { font-size: 12px; color: #999; }

.log-processo { display: flex; flex-direction: column; gap: 8px; }
.linha-log { font-size: 13px; color: #666; padding: 8px 12px; background: #f9f9f9; border-radius: 6px; margin: 0; }

.decisoes-agente p { margin: 8px 0; font-size: 14px; }

.acoes { display: flex; gap: 8px; }
.btn-acao { padding: 8px 16px; background: #f5f0ff; color: var(--cor-primaria, #7c3aed); border: none; border-radius: 6px; cursor: pointer; }

.card-ajuste {
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.linha-ajuste {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.titulo-ajuste {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #999;
  margin: 0;
}

.separador { border: none; border-top: 1px solid #eee; margin: 20px 0; }

.colunas-ajuste {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.bloco-ajuste {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.separador-vertical {
  width: 1px;
  background: #eee;
  align-self: stretch;
}
.opcoes-select {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.opcao-select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #888;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
  flex: 1 1 auto;
  white-space: nowrap;
}
.opcao-select.selecionado {
  border-color: var(--cor-primaria, #7c3aed);
  background: var(--cor-primaria-clara, rgba(124,58,237,0.15));
  color: var(--cor-primaria, #7c3aed);
}
</style>