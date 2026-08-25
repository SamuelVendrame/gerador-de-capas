<script setup lang="ts">
import { ref, watch } from "vue";
import { useDetalheCapa } from "~/composables/useDetalheCapa";

const props = defineProps<{
  registro: any;
  mostrarVoltar?: boolean;
}>();

const emit = defineEmits<{ fechar: [] }>();

const { baixarImagem, gerarVariacao, trocarLayout, registroSelecionado } = useDetalheCapa();
registroSelecionado.value = props.registro;

watch(() => props.registro, (novo) => { registroSelecionado.value = novo; });

const novoLayout = ref(props.registro.layout ?? "");
const novaFonte = ref(props.registro.fonte ?? "");

async function aplicarTrocaLayout() {
  await trocarLayout(novoLayout.value, novaFonte.value);
}
</script>

<template>
  <div class="detalhe-capa">
    <button v-if="mostrarVoltar !== false" class="btn-voltar" @click="emit('fechar')">← Voltar ao histórico</button>

    <div class="cabecalho-resultado">
      <span class="pill-aprovado">Aprovada pelo agente</span>
    </div>

    <img v-if="registroSelecionado?.caminhoImagem" :src="registroSelecionado.caminhoImagem" class="imagem-grande" alt="Capa gerada" />

    <h2>{{ registroSelecionado?.titulo }}</h2>
    <p class="autor">{{ registroSelecionado?.autor }} · {{ registroSelecionado?.genero }}</p>

    <div class="resumo-processo">
      <h3>Resumo do processo</h3>
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
    </div>

    <div v-if="registroSelecionado?.logProcesso?.length" class="log-processo">
      <p v-for="(evento, i) in registroSelecionado.logProcesso" :key="i" class="linha-log">
        {{ evento.comentario }}
      </p>
    </div>

    <div v-if="registroSelecionado?.layoutMotivo || registro.fonteMotivo || registro.avaliacaoArte" class="decisoes-agente">
      <h3>Decisões do agente</h3>
      <p v-if="registroSelecionado?.layoutMotivo"><strong>Layout:</strong> {{ registro.layoutMotivo }}</p>
      <p v-if="registroSelecionado?.fonteMotivo"><strong>Fonte:</strong> {{ registro.fonteMotivo }}</p>
      <p v-if="registroSelecionado?.avaliacaoArte"><strong>Avaliação da arte:</strong> {{ registro.avaliacaoArte }}</p>
      <p v-if="registroSelecionado?.consideracoesFinais"><strong>Considerações finais:</strong> {{ registro.consideracoesFinais }}</p>
    </div>

    <div class="acoes">
      <button class="btn-acao" @click="baixarImagem">Baixar imagem</button>
      <button class="btn-acao" @click="gerarVariacao">Gerar variação</button>
    </div>

    <div class="ajuste-manual">
      <h3>Ajustar layout e tipografia</h3>
      <p class="nota">Fora da revisão do agente — muda só o visual, sem gerar de novo.</p>

      <select v-model="novoLayout">
        <option value="centralizado">Centralizado</option>
        <option value="topoBase">Topo + Base</option>
        <option value="rodape">Rodapé</option>
        <option value="faixa">Faixa</option>
        <option value="direita">Alinhado à direita</option>
      </select>

      <select v-model="novaFonte">
        <option value="Playfair Display">Playfair Display</option>
        <option value="Cormorant Garamond">Cormorant Garamond</option>
        <option value="Bebas Neue">Bebas Neue</option>
        <option value="Space Grotesk">Space Grotesk</option>
        <option value="Baloo 2">Baloo 2</option>
      </select>

      <button class="btn-aplicar" @click="aplicarTrocaLayout">Aplicar</button>
    </div>
  </div>
</template>

<style scoped>
.detalhe-capa { display: flex; flex-direction: column; gap: 16px; }
.btn-voltar { align-self: flex-start; background: none; border: none; color: var(--cor-primaria, #7c3aed); cursor: pointer; font-size: 14px; }

.pill-aprovado {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 12px;
  font-weight: 600;
}

.imagem-grande { width: 100%; max-width: 300px; border-radius: 8px; align-self: center; }
.autor { color: #666; }

.resumo-processo, .decisoes-agente, .ajuste-manual { background: white; padding: 16px; border-radius: 8px; }
.estatisticas { display: flex; gap: 24px; margin-top: 8px; }
.estatistica { display: flex; flex-direction: column; align-items: center; }
.estatistica strong { font-size: 20px; color: var(--cor-primaria, #7c3aed); }
.estatistica span { font-size: 12px; color: #999; }

.log-processo { display: flex; flex-direction: column; gap: 8px; }
.linha-log { font-size: 13px; color: #666; padding: 8px 12px; background: #f9f9f9; border-radius: 6px; margin: 0; }

.decisoes-agente p { margin: 8px 0; font-size: 14px; }

.acoes { display: flex; gap: 8px; }
.btn-acao { padding: 8px 16px; background: #f5f0ff; color: var(--cor-primaria, #7c3aed); border: none; border-radius: 6px; cursor: pointer; }

.nota { font-size: 12px; color: #999; margin: 0 0 12px; }
.ajuste-manual select { margin-right: 8px; padding: 6px; }
.btn-aplicar { padding: 6px 14px; background: var(--cor-primaria, #7c3aed); color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 8px; }
</style>