<script setup lang="ts">
const descricao = defineModel<string>("descricao", { required: true });

defineProps<{
  erros: Record<string, string>;
}>();
</script>

<template>
  <div class="etapa">
    <h2>Sobre o que ele fala?</h2>
    <p class="subtitulo">É daqui que sai o prompt da arte de fundo. Fale do tom, do lugar, do conflito.</p>

    <div class="campo">
      <label for="descricao">Descrição breve</label>
      <textarea id="descricao" v-model="descricao" rows="4" />
      <span class="dica">Duas ou três frases bastam — é daqui que sai o prompt da arte.</span>
      <span v-if="erros.descricao" class="erro">{{ erros.descricao }}</span>
    </div>
  </div>
</template>

<style scoped>
.etapa { display: flex; flex-direction: column; gap: 16px; }
.subtitulo { color: #666; font-size: 14px; margin: -8px 0 8px; }
.campo { display: flex; flex-direction: column; gap: 4px; }
label { font-weight: 600; }
textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; resize: vertical; }
.dica { color: #999; font-size: 13px; }
.erro { color: #c00; font-size: 14px; }
</style>