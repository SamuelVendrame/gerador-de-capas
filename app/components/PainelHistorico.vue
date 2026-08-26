<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useHistorico } from "~/composables/useHistorico";
import { LABELS_STATUS, formatarDataHora } from "~/composables/useFormatacao";

const { registros, carregando, carregarHistorico, tentarNovamente } = useHistorico();
const registroAberto = ref<any>(null);
const router = useRouter();

onMounted(carregarHistorico);
defineExpose({ carregarHistorico });

function abrirDetalhe(registro: any) {
  if (registro.status === "concluido") {
    router.push(`/capa/${registro.id}`);
  } else if (registro.status === "em_processamento") {
    router.push(`/gerando?id=${registro.id}`);
  }
}

</script>

<template>
  <DetalheCapa v-if="registroAberto" :registro="registroAberto" @fechar="registroAberto = null" />

  <div v-else class="painel-historico">
    <p v-if="carregando">Carregando...</p>
    <p v-else-if="registros.length === 0" class="vazio">Nenhuma capa gerada ainda.</p>

    <div
      v-for="registro in registros"
      :key="registro.id"
      class="item-historico"
      @click="abrirDetalhe(registro)"
    >
      <img v-if="registro.caminhoImagem" :src="registro.caminhoImagem" class="thumb" alt="Capa gerada" />
      <div v-else class="thumb thumb-vazia" />

      <div class="conteudo-item">
        <div class="info">
          <strong>{{ registro.titulo }}</strong>
          <div class="infos-livro">
            <span class="info-livro">{{ registro.autor }} - </span>
            <span class="info-livro">{{ registro.fonte }} - </span>
            <span class="info-livro">{{ registro.genero }}</span>
          </div>
        </div>

        <div class="linha-status">
          <div class="status" :class="registro.status">
            <span class="icone-status">
              <svg v-if="registro.status === 'concluido'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <svg v-else-if="registro.status === 'cancelado'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              <svg v-else class="spinner" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                <circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-dashoffset="15" />
              </svg>
            </span>
            {{ LABELS_STATUS[registro.status] }}
          </div>
          <span class="data-hora">{{ formatarDataHora(registro.criadoEm) }}</span>
        </div>

        <div v-if="registro.status === 'cancelado'" class="bloco-erro" @click.stop>
          <p v-if="registro.motivoCancelamento" class="motivo">{{ registro.motivoCancelamento }}</p>
          <button class="btn-tentar-novamente" @click="tentarNovamente(registro)">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .painel-historico {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .vazio {
    color: #999;
    text-align: center;
    padding: 24px 0;
  }

  .item-historico {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    border: 1px solid #e0e0e0;
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }
  .item-historico:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .thumb {
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .thumb-vazia {
    background: #f0f0f0;
  }

  .conteudo-item {
    flex: 1;
    min-width: 0;
  }

  .infos-livro{
    display: flex;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
  }

  .info-livro {
    color: #666;
    font-size: 14px;
    margin-right: 4px;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    padding: 4px 10px 4px 4px;
    border-radius: 999px; 
  }

  .icone-status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%; 
    flex-shrink: 0;
  }

  .status.concluido {
    background: #e8f5e9;
    color: #2e7d32;
  }
  .status.concluido .icone-status {
    background: #2e7d32;
    color: white; 
  }

  .status.cancelado {
    background: #ffebee;
    color: #c62828;
  }
  .status.cancelado .icone-status {
    background: #c62828;
    color: white;
  }

  .status.em_processamento {
    background: rgba(124, 58, 237, 0.15); 
    color: #7c3aed;
  }
  .status.em_processamento .icone-status {
    background: transparent; 
    color: #7c3aed;
  }
  .bloco-erro {
  margin-top: 8px;
  padding: 12px;
  background: rgba(198, 40, 40, 0.08); 
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.motivo {
  font-size: 13px;
  color: #c62828;
  margin: 0;
}

.btn-tentar-novamente {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 6px 12px;
  background: #ef5350; 
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

  .linha-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .data-hora {
    font-size: 15px;
    color: #999;
  }

  .spinner {
  animation: girar 1s linear infinite;
  }
  @keyframes girar {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

</style>