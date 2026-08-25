<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGeracaoProgresso } from "~/composables/useGeracaoProgresso";

const { passos, finalizado, sucesso, caminhoImagem, iniciar } = useGeracaoProgresso();
const dadosLivro = ref<{ titulo?: string; genero?: string }>({});

onMounted(() => {
  const dados = JSON.parse(sessionStorage.getItem("dadosGeracaoCapa") ?? "{}");
  dadosLivro.value = dados;
  iniciar(dados);
});
</script>

<template>
  <div class="tela-progresso">
    <div class="coluna-esquerda">
      <h2>O agente está trabalhando</h2>
      <p class="subtitulo">{{ dadosLivro.titulo }}</p>

      <div class="lista-passos">
        <div v-for="(passo, i) in passos" :key="i" class="passo">
          <strong>{{ passo.titulo }}</strong>
          <p>{{ passo.comentario }}</p>
          <span class="duracao">{{ passo.duracaoSegundos.toFixed(1) }}s</span>
        </div>
      </div>
    </div>

    <div class="coluna-direita">
      <h3>Preview do agente</h3>
      <img v-if="caminhoImagem" :src="caminhoImagem" class="preview" alt="Preview da capa" />
      <div v-else class="preview preview-vazio" />

      <div class="barra-progresso">
        <div
            class="preenchido"
            :style="{ width: finalizado ? '100%' : `${Math.min(passos.length * 12.5, 90)}%` }"
        />
      </div>

      <p v-if="finalizado">
        {{ sucesso ? "Capa final aprovada pelo agente." : "Não foi possível aprovar." }}
        Concluído · {{ passos.length }} etapas
      </p>
    </div>
  </div>
</template>

<style scoped>
.tela-progresso { display: flex; gap: 32px; padding: 40px; }
.coluna-esquerda { flex: 1; }
.coluna-direita { flex: 1; }
.passo { padding: 12px 0; border-bottom: 1px solid #eee; }
.passo p { color: #666; font-size: 14px; margin: 4px 0; }
.duracao { color: #999; font-size: 12px; }
.preview { width: 100%; max-width: 300px; border-radius: 8px; }
.preview-vazio { aspect-ratio: 2/3; background: #f0f0f0; border-radius: 8px; }
.barra-progresso { height: 6px; background: #eee; border-radius: 3px; margin: 16px 0; overflow: hidden; }
.preenchido { height: 100%; background: #7c3aed; transition: width 0.3s; }
</style>