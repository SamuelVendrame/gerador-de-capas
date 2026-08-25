<script setup lang="ts">
const clima = defineModel<string>("clima");

defineProps<{ gerando: boolean }>();
const emit = defineEmits<{ gerar: [] }>();
</script>

<template>
  <div class="etapa">

    <div class="campo">
      <label for="clima">Preferências de clima (opcional)</label>
      <input id="clima" v-model="clima" type="text" placeholder="Pode deixar vazio — o agente decide sozinho." />
    </div>

    <div class="agente-decide">
      <h3>O agente decide agora</h3>
      <ul>
        <li>A tipografia do título, pelo gênero e pelo tamanho do nome do livro.</li>
        <li>O layout: título centralizado ou título no topo com autor na base.</li>
        <li>A paleta e a arte de fundo — com até 3 tentativas e autorrevisão.</li>
      </ul>
      <p class="nota">Depois da geração você pode trocar tipografia e layout com um clique e ver como fica.</p>
    </div>

    <button class="btn-gerar" :disabled="gerando" @click="emit('gerar')">
      {{ gerando ? "Gerando capa..." : "Gerar capa" }}
    </button>
  </div>
</template>

<style scoped>
.etapa { display: flex; flex-direction: column; gap: 16px; }
.subtitulo { color: #666; font-size: 14px; margin: -8px 0 8px; }
.campo { display: flex; flex-direction: column; gap: 4px; }
label { font-weight: 600; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; }
.agente-decide { background: #f5f0ff; padding: 16px; border-radius: 8px; }
.agente-decide h3 { margin: 0 0 8px; font-size: 15px; }
.agente-decide ul { margin: 0; padding-left: 20px; font-size: 14px; color: #444; }
.nota { color: #999; font-size: 13px; margin: 12px 0 0; }
.btn-gerar {
  padding: 12px 24px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
.btn-gerar:disabled { opacity: 0.6; cursor: not-allowed; }
</style>