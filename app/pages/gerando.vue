<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGeracaoProgresso } from "~/composables/useGeracaoProgresso";

const router = useRouter();
const { passos, finalizado, sucesso, caminhoImagem, iniciar } = useGeracaoProgresso();
const dadosLivro = ref<{ titulo?: string; genero?: string }>({});

onMounted(() => {
  const dados = JSON.parse(sessionStorage.getItem("dadosGeracaoCapa") ?? "{}");
  dadosLivro.value = dados;
  iniciar(dados);
});

function verResultado() {
  router.push("/");
}
</script>

<template>
  <div class="pagina">
    <div class="card-central">
      <div class="tela-progresso">
        <div class="coluna-esquerda">
          <h2>O agente está trabalhando</h2>

          <div class="status-livro">
            <span class="pill-status" :class="finalizado ? (sucesso ? 'pill-concluido' : 'pill-cancelado') : 'pill-gerando'">
              {{ finalizado ? (sucesso ? "Concluído" : "Cancelado") : "Gerando..." }}
            </span>
            <span>"{{ dadosLivro.titulo }}" · {{ dadosLivro.genero }}</span>
          </div>

          <div class="lista-passos">
            <div v-for="(passo, i) in passos" :key="i" class="passo" :class="{ 'passo-conectado': i > 0 }">
              <div class="passo-icone">
                <svg v-if="passo.status === 'sucesso'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" class="icone-sucesso">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="icone-erro">
                  <path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>

              <div class="passo-conteudo">
                <strong>{{ passo.titulo }}</strong>
                <p>{{ passo.comentario }}</p>
                <span class="duracao">{{ passo.duracaoSegundos.toFixed(1) }}s</span>
              </div>
            </div>

            <div v-if="!finalizado" class="passo passo-carregando" :class="{ 'passo-conectado': passos.length > 0 }">
              <div class="passo-icone">
                <div class="spinner-pequeno" />
              </div>
              <div class="passo-conteudo">
                <strong>Processando...</strong>
              </div>
            </div>
          </div>

          <button v-if="finalizado" class="btn-ver-resultado" @click="verResultado">
            Ver Resultado
          </button>
        </div>

        <div class="coluna-direita">
          <h3>Preview do agente</h3>

          <div class="preview-container">
            <img v-if="caminhoImagem" :src="caminhoImagem" class="preview" alt="Preview da capa" />
            <div v-else class="preview preview-skeleton" />
          </div>

          <div class="barra-progresso">
            <div class="preenchido" :style="{ width: finalizado ? '100%' : `${Math.min(passos.length * 12.5, 90)}%` }" />
          </div>

          <p v-if="finalizado" class="resultado-final">
            {{ sucesso ? "Capa final aprovada pelo agente." : "Não foi possível aprovar." }}
            Concluído · {{ passos.length }} etapas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
}
.card-central {
  max-width: 900px;
  margin: 0 auto;
  background: var(--cor-branco, white);
  border-radius: var(--raio-card, 10px);
  box-shadow: var(--sombra-card, 0 1px 4px rgba(0, 0, 0, 0.06));
  padding: 24px;
}

.tela-progresso { display: flex; gap: 32px; }
.coluna-esquerda { flex: 1.2; }
.coluna-direita { flex: 1; }

h2 { margin: 0 0 12px; font-size: 22px; }
h3 { margin: 0 0 12px; font-size: 16px; }

.status-livro {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.lista-passos { display: flex; flex-direction: column; }

.passo {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #eee;
  background: white;
  border-radius: 10px;
}
.passo-conectado { border-top: none; border-radius: 0; }
.lista-passos > .passo:first-child { border-radius: 10px 10px 0 0; }
.lista-passos > .passo:last-child { border-radius: 0 0 10px 10px; }
.lista-passos > .passo:only-child { border-radius: 10px; }

.passo-icone { flex-shrink: 0; padding-top: 2px; }
.icone-sucesso { color: #2e7d32; }
.icone-erro { color: #e65100; }

.passo-conteudo { flex: 1; }
.passo-conteudo strong { display: block; font-size: 14px; margin-bottom: 4px; }
.passo-conteudo p { color: #666; font-size: 13px; margin: 0 0 6px; line-height: 1.4; }
.duracao { color: #999; font-size: 12px; }

.pill-status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.pill-gerando { background: rgba(124, 58, 237, 0.15); color: var(--cor-primaria, #7c3aed); }
.pill-concluido { background: #e8f5e9; color: #2e7d32; }
.pill-cancelado { background: #ffebee; color: #c62828; }

.spinner-pequeno {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top-color: var(--cor-primaria, #7c3aed);
  border-radius: 50%;
  animation: girar 1s linear infinite;
}

.btn-ver-resultado {
  margin-top: 20px;
  padding: 10px 24px;
  background: var(--cor-primaria, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.preview-container { width: 100%; max-width: 300px; }
.preview-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-pulso 1.5s ease-in-out infinite;
}
@keyframes skeleton-pulso {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.preview { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 8px; display: block; }
.preview-vazio { background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
.spinner-preview {
  width: 32px; height: 32px;
  border: 3px solid #ddd; border-top-color: var(--cor-primaria, #7c3aed);
  border-radius: 50%; animation: girar 1s linear infinite;
}
@keyframes girar { to { transform: rotate(360deg); } }

.barra-progresso { height: 6px; background: #eee; border-radius: 3px; margin: 16px 0; overflow: hidden; max-width: 300px; }
.preenchido { height: 100%; background: var(--cor-primaria, #7c3aed); transition: width 0.3s; }
.resultado-final { font-size: 14px; color: #333; }
</style>